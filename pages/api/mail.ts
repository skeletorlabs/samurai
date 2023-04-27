import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body)
  // console.log(body)

  const mail = require('@sendgrid/mail')
  mail.setApiKey(process.env.NEXT_PUBLIC_SEND_GRID_API_KEY)

  const message = `
    Name: ${body.name}\r\n
    Email: ${body.email}\r\n
    Message: ${body.message}
  `
  const email = process.env.NEXT_PUBLIC_MAIL
  const data = {
    to: email,
    from: email,
    subject: `New message from ${body.name} - ${body.subject}`,
    text: message,
    html: message.replace(/\r\n/g, '<br />'),
  }

  await mail.send(data)

  res.status(200).json({ status: 'OK' })
}
