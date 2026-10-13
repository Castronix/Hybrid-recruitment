# HYBRID Social Solutions — Recruitment Website

## Included
- Dark opening screen with the official HYBRID logo in the upper-right.
- Playful rotating CLICK ME prompts, Skip Intro, and cinematic reveal.
- Separate details and application flow for Field Sales Representative and Logtech Associate.
- Original hiring posters and logo assets.
- Responsive layout and reduced-motion support.
- Vercel serverless proxy at `/api/apply` to forward application JSON to Google Apps Script without a browser-to-Apps-Script CORS request.

## Deploy to Vercel
1. Upload this folder to a Git repository and import it into Vercel (or deploy this folder with the Vercel CLI).
2. In Vercel Project Settings → Environment Variables, add:
   - Key: `HYBRID_APPS_SCRIPT_URL`
   - Value: the current deployed Apps Script Web App URL ending in `/exec`.
3. Apply the variable to Production (and Preview if testing there), then redeploy.
4. Confirm the deployed Apps Script has the revised `doPost(e)` and `submitApplication(data)` code, has been authorized by the intended Google account, and is deployed as a Web App that allows public applicants to access it.
5. Test both roles using a dummy applicant and a dummy resume before sharing the site publicly.

## Application payload mapping
The frontend maps `phone` → `contactNumber`, `location` → `preferredLocation`, sends the exact selected `position`, and converts the selected resume to Base64. Resume size is capped at 3 MB to leave headroom under Vercel's serverless request body limit. The backend can keep its 5 MB maximum, but this website intentionally enforces the lower limit.

For Logtech Associate, motorcycle and travel answers are sent as `false` because those questions are not shown for that role. The current Apps Script code must accept those boolean values; it should not require applicants to affirm motorcycle/travel requirements for Logtech.

## Accuracy notes
- Field Sales allowances, incentives, and hub coverage are based on the supplied hiring poster and remain subject to employer terms.
- The Logtech poster does not specify salary or benefits; the site says to confirm those details with recruitment rather than inventing them.
- Resume files are saved by Apps Script in a Drive folder; do not enable public sharing. Recruiters must have permission to open the files.

## Local preview
Open `index.html` in a browser to inspect the visual layout. Application submission requires the deployed Vercel API route and configured `HYBRID_APPS_SCRIPT_URL`; local `file://` preview will not submit applications.
