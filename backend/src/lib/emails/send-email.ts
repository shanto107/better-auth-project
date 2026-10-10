import { ServerClient } from "postmark";

const token = process.env.POSTMARK_SERVER_TOKEN!;
const from = process.env.POSTMARK_FROM_EMAIL!;

if (!token) {
  throw new Error("POSTMARK_SERVER_TOKEN is missing");
}

if (!from) {
  throw new Error("POSTMARK_FROM_EMAIL is missing");
}

const postmarkClient = new ServerClient(token);

type SendEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmail) {
  try {
    const result = await postmarkClient.sendEmail({
      From: from,
      To: to,
      Subject: subject,
      HtmlBody: html,
      TextBody: text,
      MessageStream: "outbound",
    });

    console.log("Postmark accepted email:", {
      to,
      messageId: result.MessageID,
      errorCode: result.ErrorCode,
      message: result.Message,
    });

    return result;
  } catch (error) {
    console.error("Postmark email failed:", error);
    throw error;
  }
}
