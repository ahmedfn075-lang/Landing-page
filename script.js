"use strict";

const NOMOR_WA = "62895351411222";
const PESAN_WA_DEFAULT = "Halo Arulsgalery, saya ingin bertanya tentang produk jajanan jadul.";
const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

let keranjang = [];

const tombolTambah = document.querySelectorAll(".btn-tambah");
const isiKeranjang = document.getElementById("isi-keranjang");
const jumlahKeranjang = document.getElementById("jumlah-keranjang");
const totalHarga = document.getElementById("total-harga");
const btnKeranjang = document.getElementById("btn-keranjang");
const closeKeranjang = document.getElementById("close-keranjang");
const keranjangPanel = document.getElementById("keranjang-panel");
const cartBackdrop = document.getElementById("cart-backdrop");
const formCheckout = document.getElementById("form-checkout");
const metodePembayaran = document.getElementById("metode-pembayaran");
const checkoutStatus = document.getElementById("checkout-status");
const formKontak = document.getElementById("form-kontak");
const formTestimoni = document.getElementById("form-testimoni");
const testimonialList = document.querySelector(".testimonial-list");

function bukaWhatsApp(pesan) {
    const url = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank", "noopener,noreferrer");
}

function bukaKeranjang() {
    if (!keranjangPanel) return;
    document.body.classList.add("cart-open");
    keranjangPanel.setAttribute("aria-hidden", "false");
    btnKeranjang?.setAttribute("aria-expanded", "true");
    if (cartBackdrop) cartBackdrop.hidden = false;
    closeKeranjang?.focus();
}

function tutupKeranjang() {
    document.body.classList.remove("cart-open");
    keranjangPanel?.setAttribute("aria-hidden", "true");
    btnKeranjang?.setAttribute("aria-expanded", "false");
    if (cartBackdrop) cartBackdrop.hidden = true;
}

function tampilkanKeranjang() {
    if (!isiKeranjang || !jumlahKeranjang || !totalHarga) return;
    isiKeranjang.replaceChildren();

    const total = keranjang.reduce((jumlah, produk) => jumlah + produk.harga, 0);

    if (keranjang.length === 0) {
        const kosong = document.createElement("p");
        kosong.className = "cart-empty";
        kosong.textContent = "Keranjang masih kosong. Yuk, pilih jajanan favoritmu!";
        isiKeranjang.appendChild(kosong);
    } else {
        keranjang.forEach((produk, index) => {
            const item = document.createElement("div");
            item.className = "keranjang-item";

            const nama = document.createElement("span");
            nama.textContent = produk.nama;

            const actions = document.createElement("div");
            actions.className = "cart-item-actions";

            const harga = document.createElement("span");
            harga.textContent = formatter.format(produk.harga);

            const hapus = document.createElement("button");
            hapus.className = "btn-hapus";
            hapus.type = "button";
            hapus.textContent = "Hapus";
            hapus.setAttribute("aria-label", `Hapus ${produk.nama} dari keranjang`);
            hapus.addEventListener("click", () => hapusProduk(index));

            actions.append(harga, hapus);
            item.append(nama, actions);
            isiKeranjang.appendChild(item);
        });
    }

    jumlahKeranjang.textContent = String(keranjang.length);
    totalHarga.textContent = formatter.format(total);
}

function hapusProduk(index) {
    keranjang.splice(index, 1);
    tampilkanKeranjang();
    if (checkoutStatus) checkoutStatus.textContent = "";
}

window.hapusProduk = hapusProduk;

tombolTambah.forEach((button) => {
    button.addEventListener("click", () => {
        const nama = button.dataset.nama;
        const harga = Number(button.dataset.harga);
        if (!nama || !Number.isFinite(harga) || harga <= 0) return;

        keranjang.push({ nama, harga });
        tampilkanKeranjang();
        if (checkoutStatus) checkoutStatus.textContent = "";
        bukaKeranjang();
    });
});

btnKeranjang?.addEventListener("click", () => {
    if (document.body.classList.contains("cart-open")) tutupKeranjang();
    else bukaKeranjang();
});
closeKeranjang?.addEventListener("click", tutupKeranjang);
cartBackdrop?.addEventListener("click", tutupKeranjang);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("cart-open")) {
        tutupKeranjang();
        btnKeranjang?.focus();
    }
});

if (formCheckout && metodePembayaran && checkoutStatus) {
    formCheckout.addEventListener("submit", (event) => {
        event.preventDefault();
        if (keranjang.length === 0) {
            checkoutStatus.textContent = "Keranjang masih kosong. Tambahkan produk sebelum memesan.";
            return;
        }
        if (!metodePembayaran.value) {
            checkoutStatus.textContent = "Silakan pilih metode pembayaran terlebih dahulu.";
            metodePembayaran.focus();
            return;
        }

        const total = keranjang.reduce((jumlah, produk) => jumlah + produk.harga, 0);
        const ringkasan = new Map();
        keranjang.forEach((produk) => {
            const key = `${produk.nama}|||${produk.harga}`;
            ringkasan.set(key, (ringkasan.get(key) || 0) + 1);
        });
        const daftar = [...ringkasan.entries()].map(([key, qty]) => {
            const [nama, harga] = key.split("|||");
            return `- ${nama} x${qty} — ${formatter.format(Number(harga) * qty)}`;
        });

        const pesan = [
            "Halo Arulsgalery, saya ingin memesan jajanan berikut:",
            "",
            ...daftar,
            "",
            `Total sementara: ${formatter.format(total)}`,
            `Pilihan pembayaran: ${metodePembayaran.value}`,
            "Mohon konfirmasi ketersediaan produk, ongkir, dan cara pembayaran. Terima kasih."
        ].join("\n");

        checkoutStatus.textContent = "Membuka WhatsApp untuk mengirim ringkasan pesanan...";
        bukaWhatsApp(pesan);
    });
}

if (formKontak) {
    formKontak.addEventListener("submit", (event) => {
        event.preventDefault();
        const nama = document.getElementById("nama-kontak")?.value.trim() || "";
        const email = document.getElementById("email-kontak")?.value.trim() || "";
        const pesan = document.getElementById("pesan-kontak")?.value.trim() || "";
        if (!nama || !pesan) return;

        const isiPesan = [
            "Halo Arulsgalery, saya ingin menghubungi Anda.",
            "",
            `Nama: ${nama}`,
            email ? `Email: ${email}` : "",
            `Pesan: ${pesan}`
        ].filter(Boolean).join("\n");
        bukaWhatsApp(isiPesan);
    });
}

function formatTanggalKomentar(date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    }).format(date);
}

if (formTestimoni && testimonialList) {
    formTestimoni.addEventListener("submit", (event) => {
        event.preventDefault();
        const namaInput = document.getElementById("nama-testimoni");
        const pesanInput = document.getElementById("pesan-testimoni");
        const nama = namaInput?.value.trim() || "";
        const pesan = pesanInput?.value.trim() || "";
        if (!nama || !pesan) return;

        const sekarang = new Date();
        const card = document.createElement("article");
        card.className = "testimonial-card";

        const quote = document.createElement("div");
        quote.className = "testimonial-quote";
        quote.setAttribute("aria-hidden", "true");
        quote.textContent = "“";

        const body = document.createElement("p");
        body.textContent = pesan;

        const info = document.createElement("div");
        info.className = "customer-info";
        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.setAttribute("aria-hidden", "true");
        avatar.textContent = [...nama][0].toUpperCase();
        const details = document.createElement("div");
        const strong = document.createElement("strong");
        strong.textContent = nama;
        const time = document.createElement("time");
        time.className = "comment-time";
        time.dateTime = sekarang.toISOString();
        time.textContent = formatTanggalKomentar(sekarang);
        details.append(strong, time);
        info.append(avatar, details);
        card.append(quote, body, info);
        testimonialList.prepend(card);
        formTestimoni.reset();
    });
}

const tahunFooter = document.getElementById("tahun-footer");
if (tahunFooter) tahunFooter.textContent = String(new Date().getFullYear());

tampilkanKeranjang();
