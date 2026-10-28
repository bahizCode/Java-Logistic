const themeButton = document.getElementById('theme-toggle');
const rootElement = document.documentElement;


function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if(savedTheme === 'dark' || (savedTheme === null && prefersDarkScheme)) {
        rootElement.classList.add('dark');
    } else {
        rootElement.classList.remove('dark');
    }
    
    themeButton.setAttribute('aria-pressed', rootElement.classList.contains('dark'));
}

themeButton.addEventListener('click', () => {
    rootElement.classList.toggle('dark');
    localStorage.setItem('theme', rootElement.classList.contains('dark') ? 'dark' : 'light');
    applyTheme();
});

applyTheme();

const btnMenu = document.getElementById('btn-menu');;
const mobileMenu = document.getElementById('mobile-menu');

btnMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    btnMenu.setAttribute('aria-expanded', !mobileMenu.classList.contains('hidden'));
});
mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    btnMenu.setAttribute('aria-expanded', false);
});

//Bagian 1: Ambil elemen dan siapkan class dot
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const carouselTrack = document.getElementById('carousel-track');
const carouselItems = document.querySelectorAll('[data-slide]');
const carouselDots = document.querySelectorAll('[data-dot]');

const dotActive = 'h-2 w-8 bg-violet-500';
const dotInactive = 'h-2 w-2 bg-slate-300 dark:bg-white/25';

//Bagian 2: Cari tahu slide mana yang sedang tampil
//Ini inti masalahnya. Track hanya “digeser”, jadi kita cari slide yang posisinya paling dekat dengan tepi kiri layar.

//Properti	Artinya	Analogi
//clientWidth	Lebar area yang kelihatan (jendelanya)	= Lebar jendela
//scrollWidth	Lebar seluruh isi, termasuk yang tersembunyi di luar layar = Panjang seluruh rel foto
//scrollLeft	Seberapa jauh isi sudah digeser ke kiri (dalam px) = Berapa jauh rel sudah ditarik
//	Analogi	Berubah saat scroll?
//offsetLeft	Jarak foto dari ujung kiri dinding	Tidak, tetap

function getCurrentIndex() {
    // Kalau sudah mentok di ujung kanan, anggap slide terakhir yang aktif
    const atEnd = carouselTrack.scrollLeft + carouselTrack.clientWidth >= carouselTrack.scrollWidth -2;
    if(atEnd) return carouselItems.length -1;

    let closest = 0;
    let smallestGap = Infinity; //infity itu angka yang lebih besar dari semua angka
    carouselItems.forEach((item, i) => {
        const gap = Math.abs(item.offsetLeft - carouselTrack.scrollLeft); //Math.abs(x)	nilai mutlak, buang tanda minus
        if(gap < smallestGap) {
            smallestGap = gap;
            closest = i;
        }
    })

    return closest;
}

//Bagian 3: Pindah ke slide tertentu + update dot

function goToSlide(index) {
    // batasi supaya tidak lewat dari 0 sampai slide terakhir
    const safe = Math.max(0, Math.min(index, carouselItems.length -1));

    carouselItems[safe].scrollIntoView({
        //scrollIntoView() memerintahkan browser: “geser sampai elemen ini kelihatan.”
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
    });
}

function updateDots() {
    const current = getCurrentIndex();

    carouselDots.forEach((dot, i) => {
        dot.className = i === current ? dotActive : dotInactive;
    });
}

carouselNext.addEventListener('click', () => goToSlide(getCurrentIndex() + 1));
carouselPrev.addEventListener('click', () => goToSlide(getCurrentIndex() - 1));

carouselDots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
});
carouselTrack.addEventListener('scroll', updateDots);
updateDots();
