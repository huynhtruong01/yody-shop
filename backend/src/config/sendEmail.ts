import { google } from 'googleapis'
import * as nodemailer from 'nodemailer'
import { InternalServerErrorException } from '@nestjs/common'
import * as dotenv from 'dotenv'

dotenv.config({
    path: '.env',
})

const OAUTH_PLAYGROUND = process.env.OAUTH_PLAYGROUND as string
const CLIENT_ID = process.env.CLIENT_ID as string
const CLIENT_SECRET = process.env.CLIENT_SECRET as string
const REFRESH_TOKEN_MAIL = process.env.REFRESH_TOKEN_MAIL as string
const MAILER = process.env.MAILER as string

export const sendEmail = async (to: string, text: string, url: string) => {
    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        OAUTH_PLAYGROUND
    )
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN_MAIL })

    try {
        const accessToken = await oauth2Client.getAccessToken()
        const transportOptions = {
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: MAILER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN_MAIL,
                accessToken: accessToken,
            },
        } as nodemailer.TransportOptions
        const transport = nodemailer.createTransport(transportOptions)
        const mailOptions = {
            from: MAILER,
            to,
            subject: 'News Website',
            text,
            html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to News Technology UTC2.</h2>
            <p>Congratulations! You're almost set to start using News Web.
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${text}</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>`,
        }

        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        throw new InternalServerErrorException(error.message)
    }
}
