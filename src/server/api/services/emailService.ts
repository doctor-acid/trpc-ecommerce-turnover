export const fakeEmailService = async (to: string, text: string, attachments: File[])=>{
    // let response = await nodemailer.send({
    //   from: 'ourtest@mail.com'
    //   to,
    //   text,
    //   attachments
    // })
  
    console.log('Mail sent to: ',to,'text: ', text, ' attachements: ', attachments)
    return {err: null, data: {msg: 'sent'}}
  }