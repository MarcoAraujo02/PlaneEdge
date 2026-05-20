import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, company, email, phone, service, message } = req.body;

  // Configura o Nodemailer com os dados do seu e-mail profissional
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", // Se for Hostinger (mude se for outro provedor)
    port: 465,
    secure: true, // true para a porta 465
    auth: {
      user: 'marcoaraujo0w@gmail.com', // Seu e-mail profissional
      pass: process.env.EMAIL_PASSWORD,       // Senha do seu e-mail (colocada nas variáveis da Vercel)
    },
  });

  try {
    await transporter.sendMail({
      from: '"Site PlanEdge" <marcoaraujo0w@gmail.com>', 
      to: 'marcoaraujo0w@gmail.com', // O e-mail onde você quer receber as mensagens
      subject: `Novo Lead - ${service}`,
      html: `<p><strong>Nome:</strong> ${name}</p><p><strong>Mensagem:</strong> ${message}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errors: [{ message: error.message }] });
  }
}