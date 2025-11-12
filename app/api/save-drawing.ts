import { NextApiRequest, NextApiResponse } from 'next';
import { Fields, Files, File, IncomingForm, Options } from 'formidable';

/**
 * Config of the submitted form
 */
const formConfig: Partial<Options> = {
  multiples: false,
  uploadDir: `./public/funksomes`,
};

/**
 * Change the next config of this api and disable the bodyParser
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Save the drawing in user's drawings
 * This is a 'user' protected route.
 *
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  } else {
    const form = new IncomingForm(formConfig);

    form.parse(req, async (err, _fields: Fields, files: Files) => {
      if (err) {
        res.status(500).end(`Error while parsing the form: ${err}`);
        return;
      }

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const file: File = (files.file as any).length ? (files.file as any)[0] : files.file;
      const mimeType: string | null = file.mimetype;
      if (!mimeType || mimeType !== 'image/png') {
        res.status(400).end('File format not allowed');
        return;
      }

      const name: string | null = file.originalFilename;
      if (!name || name.length < 7) {
        res.status(400).end('File name too short');
        return;
      }
      if (name.match(/[^a-zA-Z0-9*\s]/)) {
        res.status(400).end('File name contains forbidden characters');
        return;
      }

      // const extension = mimeType?.substring(mimeType.lastIndexOf('/') + 1);
      // const path = file.filepath.substring(0, file.filepath.lastIndexOf('/'));
      // const fileName = `${name}_0_${file.newFilename}.${extension}`;
      // TODO: Save to computer
      // rename(file.filepath, `${path}/${user.userName}/${fileName}`, () => {
      //   console.info(`Successfully saved to ${path}/${user.userName}/${fileName}`);
      // });
      res.status(200).json({
        message: 'File saved',
      });
    });
  }
}
