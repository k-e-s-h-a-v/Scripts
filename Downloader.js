// ==UserScript==
// @name        YouTube Download Extension
// @namespace   https://loader.to
// @version     1.2
// @description Browser extension to download videos
// @author      Keshav Raj   
// @downloadURL 
// @match          *://*.youtube.com/*
// ==/UserScript==

(function () {
    'use strict';
    var v = "";
    var list = "";

    document.body.addEventListener("yt-page-data-updated", function () {
        let url = new URL(window.location.href);
        v = url.searchParams.get("v");
        list = url.searchParams.get("list");

        if (!v && !list) { //if it is neither a video nor a playlist, return false
            return false;
        }
        // We are here because this page is either a playlist or a video

        let ldrS = document.getElementById("loader_single");
        if (!(ldrS === null)) {
            ldrS.remove(); // If it exist from previous video, remove it
        }
        let ldrL = document.getElementById("loader_list");
        if (!(ldrL === null)) {
            ldrL.remove(); // If it exist from previous video, remove it
        }

        if (!!v && !list) { // If a watchable without list
            // Add single downloader to video page
            let targetElement = document.querySelectorAll("[id='info-text']");
            for (let i = 0; i < targetElement.length; i++) {
                if (targetElement[i].className.indexOf("style-scope ytd-video-primary-info-renderer") > -1) {
                    targetElement[i].prepend(singleDld());
                }
            }
        } else if (!!v && !!list) { // If a watchable with list
            // Add single and list downloader to video page
            let targetElement = document.querySelectorAll("[id='info-text']");
            for (let i = 0; i < targetElement.length; i++) {
                if (targetElement[i].className.indexOf("style-scope ytd-video-primary-info-renderer") > -1) {
                    targetElement[i].prepend(listDld());
                    targetElement[i].prepend(singleDld());
                }
            }
        } else if (!v && !!list) { // If a list without watchable
            // Add list downloader to list page
            let targetElement = document.querySelectorAll("[id='stats']");
            for (let i = 0; i < targetElement.length; i++) {
                if (targetElement[i].className.indexOf("ytd-playlist-sidebar-primary-info-renderer") > -1) {
                    targetElement[i].append(listDld())
                }
            }
        }

    });

    var styleString = `
<style scoped>

.dropdown {
margin: 0px 5px 0px 0px;
display: inline-block; /*Wrap Div to new line when there is no more space*/
background-color: blue;

}

.dropbtn {
background-color: #903737;
color: white;
padding: 0px 10px;
font-size: 13px;
border: none;
cursor:pointer;
display: block;
}

.dropdown:hover > .dropbtn {background-color: #c24747;}


.dropdown-content {
display: none;
background-color: #f8f2f2;
z-index: 15;
padding: 1px 1px;
position: absolute;
z-index: 1001;
}

.dropdown-content > a {
color: black;
padding: 2px 6px;
text-decoration: none;
display: block;
 /*getComputedStyle(document.getElementsByTagName("ytd-channel-name")[0]).zIndex -- Did you know that youtube channel names have z index 1000?*/
}

.dropdown-content a:hover {
background-color: #c24747;
color: white;
}

.dropdown:hover .dropdown-content {display: block;}

</style>
`;

    function singleDld() {
        // Returns the single video downloader dropdown menu
        let html = `

<div id="loader_single" class="dropdown">
<div class="dropbtn">DL Single</div>
<div class="dropdown-content">
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/watch?v=` + v + `&f=mp3&s=1&e=1&r=extension">as MP3</a>
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/watch?v=` + v + `&f=360&s=1&e=1&r=extension">as 360p vid</a>
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/watch?v=` + v + `&f=720&s=1&e=1&r=extension">as 720p vid</a>
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/watch?v=` + v + `&f=1080&s=1&e=1&r=extension">as 1080p vid</a>
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/watch?v=` + v + `&f=1440&s=1&e=1&r=extension">as 1440p/2K vid</a>
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/watch?v=` + v + `&f=2160&s=1&e=1&r=extension">as 2160p/4K vid</a>
</div>
</div>

`;
        let singleDownloadElement = htmlToElement(html);
        singleDownloadElement.appendChild(htmlToElement(styleString))
        return singleDownloadElement;
    }

    function listDld() {
        // Returns the list downloader dropdown menu
        // See the "s=1&e=1" part? That indicates start and end video in the list for downloading.
        // If I am smart enough, I should be able to replace e with the number of videos in the list.
        // or simply type 99 :)
        let html = `

<div id="loader_list" class="dropdown">
<div class="dropbtn">DL List</div>
<div class="dropdown-content">
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/playlist?list=` + list + `&f=mp3&s=1&e=400&r=extension">as MP3</a>
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/playlist?list=` + list + `&f=360&s=1&e=400&r=extension">as 360p vid</a>
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/playlist?list=` + list + `&f=720&s=1&e=400&r=extension">as 720p vid</a>
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/playlist?list=` + list + `&f=1080&s=1&e=400&r=extension">as 1080p vid</a>
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/playlist?list=` + list + `&f=1440&s=1&e=400&r=extension">as 1440p/2K vid</a>
<a target="_blank" href="https://loader.to/?link=https://www.youtube.com/playlist?list=` + list + `&f=2160&s=1&e=400&r=extension">as 2160p/4K vid</a>
</div>
</div>

`;

        let listDownloadElement = htmlToElement(html);
        listDownloadElement.appendChild(htmlToElement(styleString))
        return listDownloadElement;
    }

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

})();
