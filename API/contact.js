import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, company, email, phone, service, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: 'marcoaraujo0w@gmail.com',
        pass: 'sua_app_password_aqui',
      },
    });

    await transporter.sendMail({
      from: '"PlanEdge Solutions" <marcoaraujo0w@gmail.com>',
      to: 'marcoaraujo0w@gmail.com',
      subject: `Novo Lead - ${service}`,
      html: `<p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Serviço:</strong> ${service}</p><p><strong>Mensagem:</strong> ${message}</p>`,
    });

    await transporter.sendMail({
      from: '"PlanEdge Solutions" <marcoaraujo0w@gmail.com>',
      to: email,
      subject: 'Confirmação de Recebimento',
      html: `<p>Olá ${name},</p><p>Recebemos sua mensagem!</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errors: [{ message: error.message }] });
  }
}