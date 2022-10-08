/* typewritter */

var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};

window.onload = function () {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff} ";
    document.body.appendChild(css);
};

//my music
var mysong = document.getElementById("mysong");
var icon = document.getElementById("icon");

icon.onclick = function () {
    if (mysong.paused) {
        mysong.play();
        icon.src = "./img/pause.png";
    }
    else {
        mysong.pause();
        icon.src = "./img/play.png";
    }
}

// papers

class Papers {
    constructor() {
        this.API_KEY = '563492ad6f917000010000015f532079745045e6a142bbab439bbf3d';
        this.galleryDIv = document.querySelector('.gallery');
        this.searchForm = document.querySelector('.header form');
        this.loadMore = document.querySelector('.load-more');
        this.paperlogo = document.querySelector('.paperlogo')
        this.pageIndex = 1;
        this.searchValueGlobal = '';
        this.eventHandle();
    }
    eventHandle() {
        document.addEventListener('DOMContentLoaded', () => {
            this.getImg(1);
        });
        this.searchForm.addEventListener('submit', (e) => {
            this.pageIndex = 1;
            this.getSearchedImages(e);
        });
        this.loadMore.addEventListener('click', (e) => {
            this.loadMoreImages(e);
        })
        this.paperlogo.addEventListener('click', () => {
            this.pageIndex = 1;
            this.galleryDIv.innerHTML = '';
            this.getImg(this.pageIndex);
        })
    }
    async getImg(index) {
        this.loadMore.setAttribute('data-img', 'curated');
        const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos)
        // console.log(data)
    }
    async fetchImages(baseURL) {
        const response = await fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: this.API_KEY
            }
        });
        const data = await response.json();
        // console.log(data);
        return data;
    }
    GenerateHTML(photos) {
        photos.forEach(photo => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
      <a href='${photo.src.original}' data-lightbox="mygallary" data-title="${photo.photographer}">
        <img class="image" src="${photo.src.large}">
        <h3>${photo.photographer}</h3>
      </a>
      `;
            this.galleryDIv.appendChild(item)
        })
    }

    async getSearchedImages(e) {
        this.loadMore.setAttribute('data-img', 'search');
        e.preventDefault();
        this.galleryDIv.innerHTML = '';
        const searchValue = e.target.querySelector('input').value;
        this.searchValueGlobal = searchValue;
        const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
        e.target.reset();
    }
    async getMoreSearchedImages(index) {
        // console.log(searchValue)
        const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`
        const data = await this.fetchImages(baseURL);
        // console.log(data)
        this.GenerateHTML(data.photos);
    }
    loadMoreImages(e) {
        let index = ++this.pageIndex;
        const loadMoreData = e.target.getAttribute('data-img');
        if (loadMoreData === 'curated') {
            // load next page for curated]
            this.getImg(index)
        } else {
            // load next page for search
            this.getMoreSearchedImages(index);
        }
    }
}

const gallery = new Papers;