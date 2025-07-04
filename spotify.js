let currentsong = new Audio();
let song;
let crrFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsong(folder) {
  crrFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  song = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".dat") ) {
      song.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  


  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songul.innerHTML = "";
  for (const songs of song) {
    songul.innerHTML =
      songul.innerHTML +
      `<li>
                          <div class="songicon"><img src="svg/music.svg" alt="" class="invert img"></div>
                          <div class="songinfo">
                              <div class="name">${songs.replaceAll(
        "%20",
        " "
      )}</div>
                              <div class="singer">Harsh</div>
                          </div>
                          <div class="play"><img class="invert img" src="svg/play.svg" alt=""></div>
                          </li>`;
  }

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playmusic(
        e.querySelector(".songinfo").firstElementChild.innerHTML.trim()
        
      );
    });
  });
  return song;

}

const playmusic = (treak, pause = false) => {
  currentsong.src = `/${crrFolder}/` + treak;
  if (!pause) {
    currentsong.play();
    play.src = "svg/pause.svg";
  }
  document.querySelector(".songname").innerHTML = decodeURI(treak);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function displayAlbms() {
  let a = await fetch(`http://127.0.0.1:3000/song/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchers = div.getElementsByTagName("a")
  let palylistCard = document.querySelector(".palylistCard")
 let array = Array.from(anchers)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    
    if (e.href.includes("/song")) {
      let folder = (e.href.split("/").slice(-2)[0])
      let a = await fetch(`http://127.0.0.1:3000/song/${folder}/info.json`);
      let response = await a.json();
      console.log(response)
      palylistCard.innerHTML = palylistCard.innerHTML + ` <div data-folder="${folder}" class="card">
                            <div class="playButton">
                                <img class="img" src="svg/playButton.svg" alt="playButton">
                            </div>
                            <figure id="card1">
                                <img src="/song/${folder}/playlist.jpeg" alt="playlist1">
                                <figcaption class="card1">
                                    <p>${response.title} : ${response.discription}</p>
                                </figcaption>
                            </figure>
                        </div>`

    }
}

  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      song = await getsong(`song/${item.currentTarget.dataset.folder}`);
      playmusic(song[0])
    })
  })
}


async function main() {
  await getsong(`song/fighting`);
  playmusic(song[0], true);
  console.log(song);

  displayAlbms()

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "svg/pause.svg";
    } else {
      currentsong.pause();
      play.src = "svg/play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )} / ${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  document.querySelector(".humburger").addEventListener("click", () => {
    document.querySelector(".contanior_1").style.left = "0";
  });
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".contanior_1").style.left = "-120%";
  });

  preious.addEventListener("click", () => {
    let index = song.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playmusic(song[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    let index = song.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < song.length) {
      playmusic(song[index + 1]);
    }
  });

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentsong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 100;
    }

})


}


main();