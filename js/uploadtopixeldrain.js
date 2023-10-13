const axios = require('axios');
const shell = require('shelljs');

const checkAndInstallCommand = async (command) => {
  if (!shell.which(command)) {
    console.log(`${command} is not installed. Trying to install it...`);
    if (shell.which('apt-get')) {
      const result = shell.exec(`sudo apt-get update && sudo apt-get install -y ${command}`);
      if (result.code !== 0) {
        console.error(`Could not install ${command}. Please install it manually.`);
        process.exit(1);
      }
    } else {
      console.error(`${command} is not installed, and the system is not Linux. Please install it manually.`);
      process.exit(1);
    }
  }
};

const uploadAndGetDirectLink = async (filePath) => {
  try {
    await checkAndInstallCommand('curl');
    await checkAndInstallCommand('jq');

    const fileResponse = await axios.post('https://pixeldrain.com/api/file/', null, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Uploading: ${percentCompleted}%`);
      },
    });

    if (fileResponse.status === 200 && fileResponse.data && fileResponse.data.id) {
      const fileId = fileResponse.data.id;
      let infoLink, dlLink;

      if (filePath.startsWith('https://pixeldrain.com/l')) {
        infoLink = `https://pixeldrain.com/api/list/${fileId}`;
        dlLink = `https://pixeldrain.com/api/list/${fileId}/zip?download`;
      } else {
        infoLink = `https://pixeldrain.com/api/file/${fileId}/info`;
        dlLink = `https://pixeldrain.com/api/file/${fileId}?download`;
      }

      const infoResponse = await axios.get(infoLink);

      if (infoResponse.status === 200 && infoResponse.data && infoResponse.data.success === true) {
        console.log('\nUploaded file and obtained Direct Download Link:', dlLink);
      } else {
        console.error('ERROR: Can\'t download due to an issue.');
      }
    } else {
      console.error('ERROR: File upload failed.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

if (process.argv.length !== 3) {
  console.log('Usage: node script.js <path_to_file.zip>');
  process.exit(1);
}

const filePath = process.argv[2];
uploadAndGetDirectLink(filePath);
