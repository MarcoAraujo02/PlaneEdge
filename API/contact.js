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
    // Envia o e-mail para você (o destinatário principal)
    await transporter.sendMail({
      from: '"Site PlanEdge" <marcoaraujo0w@gmail.com>',
      to: 'marcoaraujo0w@gmail.com', // O e-mail onde você quer receber as mensagens
      subject: `Novo Lead - ${service}`,
      html: `
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Empresa:</strong> ${company || 'Não informado'}</p>
        <p><strong>Email do Contato:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
        <p><strong>Serviço de Interesse:</strong> ${service}</p>
        <p><strong>Mensagem:</strong> ${message}</p>
      `,
    });

    // Envia uma cópia ou confirmação para o cliente (o remetente do formulário)
    await transporter.sendMail({
      from: '"PlanEdge Solutions" <marcoaraujo0w@gmail.com>', // Seu e-mail profissional
      to: email, // O e-mail do cliente que preencheu o formulário
      subject: 'Confirmação de Recebimento - PlanEdge Solutions',
      html: `
        <p>Olá ${name},</p>
        <p>Recebemos sua mensagem e agradecemos o seu contato com a PlanEdge Solutions.</p>
        <p>Entraremos em contato em breve para discutir suas necessidades relacionadas a <strong>${service}</strong>.</p>
        <p>Atenciosamente,</p>
        <p>Equipe PlanEdge Solutions</p>
        <hr>
        <p><small>Esta é uma mensagem automática, por favor, não responda a este e-mail.</small></p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error); // Adicione um log para depuração
    return res.status(500).json({ errors: [{ message: error.message }] });
  }
}