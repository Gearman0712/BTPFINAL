const socket = io('/')
const videoGrid =document.getElementById('video-grid');
const myVideo = document.createElement('video');
//var dataURLtoBlob = require('dataurl-to-blob');
var ImgName ="";
var width = 400; // We will scale the photo width to this
var height = 300; 
var streaming = false;
var video1 = null;
var canvas = null;

var photo = null;
function myFunction() {
  var person = prompt("Please enter your name", "Harry Potter");
  if (person != null) {
   ImgName = person;
  }
}
//myFunction();
const firebaseConfig = 
{
  apiKey: "AIzaSyACPG4YXZRrcinflPHrVglebLUCeqB5Rf4",
  authDomain: "attendance-f9a49.firebaseapp.com",
  databaseURL: "https://attendance-f9a49.firebaseio.com",
  projectId: "attendance-f9a49",
  storageBucket: "attendance-f9a49.appspot.com",
  messagingSenderId: "433047762633",
  appId: "1:433047762633:web:2f6bb4a194df8670a0ff18",
  measurementId: "G-09D2D04S35"
};
var mainstream;

video1 = document.getElementById('video1');
canvas = document.getElementById('canvas');
photo = document.getElementById('photo');
myVideo.muted =true;
var peer = new Peer(undefined,{
  path: '/peerjs',
  host: '/',
  port: '443'
});
// id is basically a id that a new user after connection gets
peer.on ('open',id =>{                    
   socket.emit('join-room' ,ROOM_ID,id);
})
var myVideoStream=null;
var stream1 = null
var clonestream;
navigator.mediaDevices.getUserMedia(
    { video:true,
      audio: true

    }
).then(stream =>{
    
    clearphoto();
    mainstream = stream;
    addVideoStream(video1,stream);
    clonestream = stream.clone();
    myVideoStream =clonestream;
    addVideoStream(myVideo,clonestream);
   //let track = myVideoStream.getVideoTracks()[0];
    peer.on('call', call =>{
        call.answer(clonestream);
        const video = document.createElement('video');
        call.on('stream',userVideoStream =>{
            addVideoStream(video,userVideoStream);
        })
    });
    socket.on('user-connected',(userId) =>{
        connectToNewUser(userId,clonestream);
    })


    firebase.initializeApp(firebaseConfig);
      
  setTimeout(() => {  console.log("World!"); 
  
  myFunction(); }, 3000)
  setTimeout(() => {  console.log("World!"); 
  
  looping (); }, 10000)

})
function looping ()
{ for (let i=1; i<270; i++) { 
  task(i); 
} 



}
function task(i) { 
  setTimeout(function() { 
      // Add tasks to do 
      takepicture(i);
  }, 20000 * i); 
} 



function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

var download = function(i){
  var link = document.createElement('a');
  link.download = 'filename.jpg';
  link.href = document.getElementById('canvas').toDataURL("image/jpeg",1);
 
  //link.click();
  //firebase
  //Variables
  var ImgUrl;
  
  var reader;
 //configration
 var bolb = dataURLtoBlob(document.getElementById('canvas').toDataURL("image/jpeg"));
// selection process
//upload process

var uploadTask = firebase.storage().ref('Images/'+ImgName+".jpg").put(bolb);
uploadTask.on('state_changed' ,function(snapshot){
console.log("hi");
},
function(error)
{
  alert('error in saving image');
},
//submitting image link
function(){
  uploadTask.snapshot.ref.getDownloadURL().then(function(url){
    ImgUrl = url;
 
  firebase.database().ref('Pictures/'+ImgName).set({
    Name:ImgName,
    Link :ImgUrl,
    Counter : i
  });
  console.log('image Added succesfully');
 

}
);
});

}

function clearphoto() {
  var context = canvas.getContext('2d');
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  var data = canvas.toDataURL('image/jpeg');
  photo.setAttribute('src', data);
} 
function takepicture(i){
  // height = video1.videoHeight / (video1.videoWidth / width);

  // if (isNaN(height)) {
  //     height = width / (4 / 3);
  // }

  video1.setAttribute('width', width);
  video1.setAttribute('height', height);
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  streaming = true;

  console.log("def");
  var context = canvas.getContext('2d');
  if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video1, 0, 0, width, height);

      var data = canvas.toDataURL('image/jpeg');
     // document.write('<img src="'+data+'"/>');
    download(i);
      photo.setAttribute('src', data);
  } else {
      clearphoto();
  }
  console.log("end");
}

//socket.emit('join-room',ROOM_ID);


//console.log(ImgName);
const connectToNewUser =(userId,stream) =>{
    const call = peer.call(userId, stream);
    const video =document.createElement('video')
  call.on('stream', userVideoStream =>{
 addVideoStream(video ,userVideoStream)
  })
}

 

const addVideoStream =(video ,stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}
  // input value
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      var d= text.val()+"#$@$%&"+ImgName;
        console.log(d) 
      socket.emit('message', d,ROOM_ID);
    
    }
  });
  socket.on('createMessage' ,(message) =>{
     var o= message;
     var r= o.split('#$@$%&');
     $('ul').append(`<li class="message"><b>${r[1]}</b><br/>${r[0]}</li>`)
     scrollToBottom();
  })
  const scrollToBottom =  () =>{
     let d= $('.main_chat_window');
     d.scrollTop(d.prop("scrollHeight"));
  }
  const muteUnmute = () => {
  
    const enabled = mainstream.getAudioTracks()[0].enabled;
    if (enabled) {
      mainstream.getAudioTracks()[0].enabled = false;
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      mainstream.getAudioTracks()[0].enabled = true;
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
  }
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
  }
  const playStop = () => {
   
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
        
    } else {
        setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
  }
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
  }
  