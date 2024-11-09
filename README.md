# Setup OIDC AWS Profile Action

This GitHub Action sets up an AWS profile using OpenID Connect (OIDC) authentication. It obtains a GitHub token and uses it to assume an AWS IAM role, then configures an AWS profile with the temporary credentials.

## Usage

### Inputs

- `profile-name`: The name of the AWS profile to create.
- `role-to-assume`: The ARN of the AWS IAM role to assume.
- `session-name`: The name of the session to assume the role.
- `aws-region`: The AWS region to use.

### Example

```yaml
uses: wonko/gha-aws-oidc-profiles@v0.1
with:
  profile-name: my-profile
  role-to-assume: arn:aws:iam::123456789012:role/my-role
  session-name: my-session
  aws-region: us-east-1
```
