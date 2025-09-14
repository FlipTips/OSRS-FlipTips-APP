# How to Deploy (for kids and adults)

This repository comes with a two–button deployment setup that makes shipping
changes easy and safe.  Follow these steps whenever you want to push new
images or code live.

## 1. Add new images

1. Save your images in the folder `public/assets/ui/` at the root of the
   project.  For example, place `card-parchment.png` here.
2. Commit and push the images to the repository using GitHub (either via the
   web interface or a Git client).

## 2. Deploy to staging (preview)

1. In GitHub, click the **Actions** tab at the top of the repository.
2. In the left‑hand list, select **Ship to Staging**.
3. Click **Run workflow**.  This will build and deploy the latest code and
   assets to the staging environment.  Wait for the workflow run to finish.
4. Once complete, open the URL provided in the workflow summary.  This is
   your preview of the app running with the latest changes.  Check that
   everything looks and works correctly.

## 3. Promote to production

1. After verifying that staging looks good, return to the **Actions** tab.
2. Select **Ship to Production**.
3. Click **Run workflow**.  When prompted for confirmation, type `SHIP` and
   press **Run**.  This will deploy the current branch to production.

## 4. Roll back if needed

If something goes wrong after deployment, you can instantly roll back:

1. Open the Vercel dashboard for your project.
2. Navigate to **Deployments**.
3. Find the previous deployment marked as production and click **Promote to
   Production**.  This will restore the previous working version.

That's it!  You now have a safe, repeatable process for shipping updates.