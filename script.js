let keranjang = [];

const tombolTambah = document.querySelectorAll(".btn-tambah");
const isiKeranjang = document.getElementById("isi-keranjang");
const jumlahKeranjang = document.getElementById("jumlah-keranjang");
const totalHarga = document.getElementById("total-harga");
const btnKeranjang = document.getElementById("btn-keranjang");
const closeKeranjang = document.getElementById("close-keranjang");
const keranjangPanel = document.getElementById("keranjang-panel");
const formCheckout = document.getElementById("form-checkout");
const metodePembayaran = document.getElementById("metode-pembayaran");
const checkoutStatus = document.getElementById("checkout-status");
const formKontak = document.getElementById("form-kontak");
const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

function formatTanggalKomentar(date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

const formTestimoni = document.getElementById("form-testimoni");
const testimonialList = document.querySelector(".testimonial-list");

if (formTestimoni && testimonialList) {
    formTestimoni.addEventListener("submit", (event) => {
        event.preventDefault();

        const namaInput = document.getElementById("nama-testimoni");
        const pesanInput = document.getElementById("pesan-testimoni");

        if (!namaInput || !pesanInput) return;

        const nama = namaInput.value.trim();
        const pesan = pesanInput.value.trim();

        if (!nama || !pesan) return;

        const sekarang = new Date();
        const avatar = nama.charAt(0).toUpperCase();

        const komentarBaru = document.createElement("article");
        komentarBaru.className = "testimonial-card";
        komentarBaru.innerHTML = `
            <p>"${pesan}"</p>
            <div class="customer-info">
                <div class="avatar">${avatar}</div>
                <div>
                    <strong>${nama}</strong>
                    <time class="comment-time" datetime="${sekarang.toISOString()}">${formatTanggalKomentar(sekarang)}</time>
                </div>
            </div>
        `;

        testimonialList.prepend(komentarBaru);
        formTestimoni.reset();
    });
}

function tampilkanKeranjang() {
    if (!isiKeranjang || !jumlahKeranjang || !totalHarga) return;

    isiKeranjang.innerHTML = "";

    let total = 0;

    keranjang.forEach((produk, index) => {
        total += produk.harga;

        const item = document.createElement("div");
        item.className = "keranjang-item";

        item.innerHTML = `
            <span>${produk.nama}</span>
            <div>
                <span>${formatter.format(produk.harga)}</span>
                <button class="btn-hapus" type="button" onclick="hapusProduk(${index})">Hapus</button>
            </div>
        `;

        isiKeranjang.appendChild(item);
    });

    jumlahKeranjang.textContent = keranjang.length;
    totalHarga.textContent = formatter.format(total);
}

function hapusProduk(index) {
    keranjang.splice(index, 1);
    tampilkanKeranjang();
    if (checkoutStatus) checkoutStatus.textContent = "";
}

if (formCheckout && metodePembayaran && checkoutStatus) {
    formCheckout.addEventListener("submit", (event) => {
        event.preventDefault();

        if (keranjang.length === 0) {
            checkoutStatus.textContent = "Keranjang masih kosong. Tambahkan produk sebelum checkout.";
            return;
        }
        
        const total = keranjang.reduce((jumlah, produk) => jumlah + produk.harga, 0);
        checkoutStatus.textContent =
            `Pesanan siap dikonfirmasi dengan ${metodePembayaran.value}. Total ${formatter.format(total)}`;
    });
}

tombolTambah.forEach((button) => {
    button.addEventListener("click", () => {
        const nama = button.dataset.nama;
        const harga = Number(button.dataset.harga);

        keranjang.push({ nama, harga });
        tampilkanKeranjang();
        if (checkoutStatus) checkoutStatus.textContent = "";

        if (keranjangPanel) {
            document.body.classList.add("cart-open");
        }
    });
});

if (btnKeranjang && keranjangPanel) {
    btnKeranjang.addEventListener("click", () => {
        document.body.classList.toggle("cart-open");
    });

    closeKeranjang?.addEventListener("click", () => {
        document.body.classList.remove("cart-open");
    });
}

if (formKontak) {
    formKontak.addEventListener("submit", (event) => {
        event.preventDefault();
        alert("Pesan Anda telah terkirim. Kami akan segera membalas!.");
        formKontak.reset();
    });
}

tampilkanKeranjang();
