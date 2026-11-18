# Kalender Ulang Tahun

A single-page birthday calendar built with React, TypeScript, Vite, and Tailwind CSS. It opens on the viewer's current month and provides year, month, and day views.

## Run locally

```bash
npm install
npm run dev
```

Set `VITE_GAS_URL` in `.env` to the Google Apps Script endpoint. The endpoint should return:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nama": "Example Name",
      "panggoaran": null,
      "tgllahir": 29,
      "blnlahir": 2,
      "thnlahir": 2000
    }
  ]
}
```

Birth date fields can be JSON numbers or numeric strings. February 29 birthdays appear only in leap years. Records with invalid birth dates remain visible in a correction list below the calendar. “Today” follows the viewer's local timezone.

## Checks

```bash
npm test
npm run lint
npm run build
```
