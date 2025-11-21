import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request: NextRequest) {
  try {
    const { workflowId, topic, rhyme, timestamp, audioUrl, videoUrl, youtubeUrl, status } = await request.json()

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      throw new Error('Google Sheet ID not configured')
    }

    // Prepare row data
    const values = [[
      workflowId,
      timestamp,
      topic,
      rhyme || '',
      audioUrl || '',
      videoUrl || '',
      youtubeUrl || '',
      status || 'in-progress'
    ]]

    // Check if workflow already exists
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:A',
    })

    const existingRows = existingData.data.values || []
    const rowIndex = existingRows.findIndex(row => row[0] === workflowId)

    if (rowIndex > -1) {
      // Update existing row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Sheet1!A${rowIndex + 1}:H${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      })
    } else {
      // Append new row
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:H',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      })
    }

    return NextResponse.json({ success: true, workflowId })
  } catch (error: any) {
    console.error('Error logging to sheet:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to log to Google Sheets' },
      { status: 500 }
    )
  }
}
