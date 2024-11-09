const core = require('@actions/core');
const { STSClient, AssumeRoleWithWebIdentityCommand, GetCallerIdentityCommand } = require('@aws-sdk/client-sts');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function assumeRoleWithOIDC(roleArn, sessionName, awsRegion) {
    const idToken = await core.getIDToken();

    const stsClient = new STSClient({ region: awsRegion });
    const creds = await stsClient.send(new AssumeRoleWithWebIdentityCommand({
        RoleArn: roleArn,
        RoleSessionName: sessionName,
        WebIdentityTokenFile: idToken,
    }));

    console.log(creds);
    return creds;
}

async function setupProfile(creds, profileName, awsRegion) {

    const awsConfigDir = path.join(os.homedir(), '.aws');
    await fs.mkdir(awsConfigDir, { recursive: true });

    const configContent = `[${profileName}]
aws_access_key_id = ${creds.Credentials.AccessKeyId}
aws_secret_access_key = ${creds.Credentials.SecretAccessKey}
aws_session_token = ${creds.Credentials.SessionToken}
region = ${awsRegion}

`;

    const configPath = path.join(awsConfigDir, 'config');
    await fs.appendFile(configPath, configContent, 'utf8');
}

async function verifySession(awsRegion) {
    const stsClient = new STSClient({ region: awsRegion });
    const identity = await stsClient.send(new GetCallerIdentityCommand());
    console.log(identity);
}

try {
    const profileName = core.getInput('profile-name');
    const roleArn = core.getInput('role-to-assume');
    const sessionName = core.getInput('session-name');
    const awsRegion = core.getInput('aws-region');

    const creds = assumeRoleWithOIDC(roleArn, sessionName, awsRegion);
    setupProfile(creds, profileName, awsRegion);
    verifySession(awsRegion);

    console.log(`configured ${profileName}!`);
} catch (error) {
    core.setFailed(error.message);
}
