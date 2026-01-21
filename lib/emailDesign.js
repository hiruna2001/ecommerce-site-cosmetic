export default function getDesignedEmail({
    otp,
    companyName = "Royal Cosmetic",
    supportEmail = "hirunadasun777@gmail.com"
}) {
    return `
    <div style="
        background-color: #fef3e2;
        padding: 40px;
        font-family: Arial, Helvetica, sans-serif;
        color: #393E46;
    ">
        <div style="
            max-width: 520px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        ">

            <!-- Header -->
            <div style="
                background-color: #fa812f;
                padding: 24px;
                text-align: center;
            ">
                <h1 style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 22px;
                    letter-spacing: 1px;
                ">
                    ${companyName}
                </h1>
            </div>

            <!-- Body -->
            <div style="padding: 30px; text-align: center;">
                <h2 style="
                    margin-bottom: 10px;
                    color: #393E46;
                ">
                    OTP Verification
                </h2>

                <p style="
                    font-size: 15px;
                    line-height: 1.6;
                    margin-bottom: 25px;
                ">
                    Use the One-Time Password (OTP) below to reset your password.
                    This code is valid for a limited time.
                </p>

                <!-- OTP Box -->
                <div style="
                    display: inline-block;
                    background-color: #fef3e2;
                    padding: 16px 32px;
                    border-radius: 10px;
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 6px;
                    color: #fa812f;
                    margin-bottom: 25px;
                ">
                    ${otp}
                </div>

                <p style="
                    font-size: 13px;
                    color: #666;
                ">
                    If you did not request this action, please ignore this email.
                </p>
            </div>

            <!-- Footer -->
            <div style="
                background-color: #393E46;
                padding: 16px;
                text-align: center;
                font-size: 12px;
                color: #ffffff;
            ">
                <p style="margin: 4px 0;">
                    Need help? Contact us at
                    <a href="mailto:${supportEmail}" style="color: #fa812f; text-decoration: none;">
                        ${supportEmail}
                    </a>
                </p>
                <p style="margin: 4px 0;">
                    © ${new Date().getFullYear()} ${companyName}. All rights reserved.
                </p>
            </div>

        </div>
    </div>
    `;
}
