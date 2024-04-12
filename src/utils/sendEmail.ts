import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

type sendEmailTypes = {
  email: string;
  subject?: string;
  text?: any;
  res?: Response;
  template?: string;
  compiledTemplateData?: any;
};

export const sendEmail = async ({
  email,
  subject,
  text,
  template,
  compiledTemplateData,
}: sendEmailTypes) => {
  try {
    const transporter = nodemailer.createTransport({
      port: parseInt(process.env.SMTP_PORT || ''),
      host: process.env.SMTP_HOST,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailTemplatePath = path.join(
      __dirname,
      "../",
      "templates",
      template
    );
    const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
    const compiledTemplate = ejs.compile(emailTemplate);

    await transporter.sendMail({
      from: "no-reply@gromet.rs",
      to: email,
      subject: subject || "Verify Your Account",
      html: template ? compiledTemplate(compiledTemplateData) : "",
      text: text,
    });

    console.log("Email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};