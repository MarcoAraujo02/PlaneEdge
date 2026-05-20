const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  console.log('METHOD:', req.method);
  console.log('BODY:', JSON.stringify(req.body));
  console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let body = req.body;

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch(e) {
      console.error('ERRO AO PARSEAR BODY:', e.message);
      return res.status(400).json({ message: 'Invalid JSON' });
    }
  }

  const { name, company, email, phone, service, message } = body || {};

  if (!email || !name) {
    console.error('CAMPOS OBRIGATORIOS FALTANDO - email:', email, 'name:', name);
    return res.status(400).json({ message: 'Missing required fields' });
  }

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

    console.log('TRANSPORTER CRIADO, enviando email...');

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

    console.log('EMAIL PARA EMPRESA ENVIADO');

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

    console.log('EMAIL DE CONFIRMACAO PARA CLIENTE ENVIADO');

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('ERRO NODEMAILER:', error.message);
    console.error('STACK:', error.stack);
    return res.status(500).json({ errors: [{ message: error.message }] });
  }
};