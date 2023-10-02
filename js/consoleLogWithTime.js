const timezone = "Asia/Jakarta";

const consoleLog = console.log;
console.log = function () {
  const currentTime = () => {
    let date_ob = new Date(
      new Date().toLocaleString("en", { timeZone: timezone })
    );
    let hours = zeroPad(date_ob.getHours());
    let minutes = zeroPad(date_ob.getMinutes());
    let seconds = zeroPad(date_ob.getSeconds());
    let milsec = zeroPad(date_ob.getMilliseconds(), true);

    return hours + ":" + minutes + ":" + seconds + ":" + milsec;
  };

  const zeroPad = (str, s = false) => {
    str = str.toString();
    if (s) {
      str = str.length > 2 ? str.substring(0, 2) : str;
    }
    return str.length >= 2 ? str : "0" + str;
  };

  consoleLog(`${currentTime()}`, ...arguments);
};

console.log("https://github.com/janexmgd/itz-hacktoberfest/");
