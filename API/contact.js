const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, company, email, phone, service, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'marcoaraujo0w@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"PlanEdge Solutions" <marcoaraujo0w@gmail.com>',
      to: 'marcoaraujo0w@gmail.com',
      subject: `Novo Lead - ${service}`,
      html: `
        <h3>Novo contato pelo site PlanEdge</h3>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Empresa:</strong> ${company || 'Não informada'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
        <p><strong>Serviço:</strong> ${service}</p>
        <p><strong>Mensagem:</strong> ${message}</p>
      `,
    });

    await transporter.sendMail({
      from: '"PlanEdge Solutions" <marcoaraujo0w@gmail.com>',
      to: email,
      subject: 'Confirmação de Recebimento - PlanEdge Solutions',
      html: `
        <p>Olá <strong>${name}</strong>,</p>
        <p>Recebemos a sua mensagem com interesse no serviço de <strong>${service}</strong>!</p>
        <p>Nossa equipe técnica analisará o escopo do seu projeto e entrará em contato muito em breve.</p>
        <br>
        <p>Atenciosamente,</p>
        <p><strong>PlanEdge Solutions</strong></p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errors: [{ message: error.message }] });
  }
};