# Preview Deployment Setup

This document explains how to set up and use the automatic preview deployment system for the OSRS FlipTips app.

## Overview

The preview deployment system automatically creates a live preview of your changes when you open a pull request. This allows the testing team to validate changes on real devices before merging to main.

## How it works

1. When you open, update, or reopen a pull request, GitHub Actions automatically:
   - Builds the application
   - Deploys it to Cloudflare staging environment
   - Posts a comment on the PR with the preview URL
   - Updates the URL if you push new changes

2. The preview uses the existing staging environment configured in `wrangler.toml`

## Required Repository Secrets

To enable preview deployments, the following GitHub repository secrets must be configured:

### CF_API_TOKEN (Required)
- **Purpose**: Cloudflare API token for deployment authentication
- **Scopes Required**: 
  - `Cloudflare Workers:Edit` (for Workers deployments)
  - `Account:Read` (to access account information)
  - `Zone:Read` (if using custom domains)

**To create this token:**
1. Go to [Cloudflare Dashboard > My Profile > API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use the "Custom token" template
4. Set the following permissions:
   - Account: `Cloudflare Workers:Edit`
   - Account: `Account:Read`
   - Zone: `Zone:Read` (if using custom domains)
5. Set Account Resources to include your account
6. Set Zone Resources to include your domain (if applicable)
7. Copy the generated token

### CF_ACCOUNT_ID (Optional)
- **Purpose**: Cloudflare account ID
- **Note**: This can be specified in `wrangler.toml` instead of as a secret

**To find your account ID:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account
3. The Account ID is shown in the right sidebar

## Adding Secrets to GitHub Repository

1. Go to your repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Add each secret with the name and value as described above

## Testing Preview Deployments

### Automatic Testing
- Create a pull request or push changes to an existing PR
- Check the **Actions** tab to see the deployment progress
- Look for the preview URL in the PR comment

### Manual Testing
- Go to the **Actions** tab
- Select **Deploy Preview** workflow
- Click **Run workflow**
- Choose the branch you want to deploy

## Preview URL Format

Preview deployments use the staging environment and will be accessible at the URL configured in your `wrangler.toml` staging environment or the default Cloudflare Workers URL.

## Troubleshooting

### Deployment Fails with "CF_API_TOKEN secret is missing"
- Ensure you've added the `CF_API_TOKEN` secret to your repository
- Verify the token has the correct permissions

### Deployment Fails with Authentication Error
- Check that your `CF_API_TOKEN` is valid and hasn't expired
- Verify the token has the required scopes
- Make sure the `CF_ACCOUNT_ID` matches your Cloudflare account

### Preview URL Not Posted to PR
- Check the Actions logs for any errors in the comment posting step
- Ensure the GitHub token has permissions to comment on issues

### Changes Not Reflected in Preview
- Each push to the PR branch triggers a new deployment
- Allow 1-2 minutes for deployment to complete
- Check that the commit hash in the PR comment matches your latest commit

## Configuration

The preview deployment is configured in `.github/workflows/deploy-preview.yml` and uses:
- **Environment**: `staging` (from `wrangler.toml`)
- **Trigger**: Pull request events (opened, synchronize, reopened) and manual dispatch
- **Deployment method**: Cloudflare Workers via Wrangler CLI

## Staging Environment Configuration

The staging environment is already configured in `wrangler.toml`:

```toml
[env.staging]
name = "osrs-flip-staging"
routes = [
  { pattern = "osrsfliptips.com/v2/*", zone_name = "osrsfliptips.com" }
]
```

This means preview deployments will be accessible at `osrsfliptips.com/v2/*` paths.

## Security Notes

- Secrets are handled securely by GitHub Actions
- API tokens should have minimal required permissions
- Preview deployments do not affect production settings
- Only repository collaborators with write access can trigger deployments