import path from 'path';
import { fileURLToPath } from 'url';

import ejs from 'ejs';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const getEmailHtml = async (templateName, data) => {
  try {
    const templatePath = path.join(__dirname, `../views/emails/templates/${templateName}.ejs`);

    const html = await ejs.renderFile(templatePath, data);

    return html;
  } catch (error) {
    console.error(`Email Template Error: ${error.message}`);
    throw error;
  }
};

export default getEmailHtml;
