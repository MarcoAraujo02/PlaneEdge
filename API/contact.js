import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, company, email, phone, service, message } = req.body;

  if (!name || !email || !service || !message) {
    return res.status(400).json({ 
      errors: [{ message: 'Por favor, preencha todos os campos obrigatórios' }] 
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: 'marcoaraujo0w@gmail.com',
        pass: 'jhpw vaac rppb zytd', // Gera em myaccount.google.com/apppasswords
      },
    });

    // Email para você
    await transporter.sendMail({
      from: '"PlanEdge Solutions" <marcoaraujo0w@gmail.com>',
      to: 'marcoaraujo0w@gmail.com',
      subject: `Novo Lead - ${service}`,
      html: `
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Empresa:</strong> ${company || 'Não informado'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
        <p><strong>Serviço:</strong> ${service}</p>
        <p><strong>Mensagem:</strong> ${message}</p>
      `,
    });

    // Email de confirmação para o cliente
    await transporter.sendMail({
      from: '"PlanEdge Solutions" <marcoaraujo0w@gmail.com>',
      to: email,
      subject: 'Confirmação de Recebimento - PlanEdge Solutions',
      html: `
        <p>Olá ${name},</p>
        <p>Recebemos sua mensagem e agradecemos o seu contato com a PlanEdge Solutions.</p>
        <p>Entraremos em contato em breve para discutir suas necessidades relacionadas a <strong>${service}</strong>.</p>
        <p>Atenciosamente,<br>Equipe PlanEdge Solutions</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return res.status(500).json({ 
      errors: [{ message: error.message }] 
    });
  }
}