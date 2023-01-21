# DnD Sheet Generator for Kobo
Generates a HTML file that will display DnD sheet info from JSON files created by: [mavanmanen/dnd-sheet](https://github.com/mavanmanen/dnd-sheet)

## Requirements
- NPM

## Project Setup
`npm install`

## Compile sheets
- Create `sheets.json` in the root directory with the following format:
  ```json
  {
    "Sheet1": "URL",
    "Sheet2": "URL"
  }
  ```
- Run the following command: `npm run build`

## Watch and compile for development
`npm run watch`