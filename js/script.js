document.addEventListener("DOMContentLoaded", () => {
  // Elemen DOM
  const inputTugas = document.getElementById("inputTugas");
  const tombolTambah = document.getElementById("tombolTambah");
  const daftarTugas = document.getElementById("daftarTugas");
  const totalTugasEl = document.getElementById("totalTugas");
  const tugasSelesaiEl = document.getElementById("tugasSelesai");

  // Data Tugas
  let tugas = [];

  // Muat tugas dari localStorage
  muatTugas();
  perbaruiStatistik();

  // Event Listeners
  tombolTambah.addEventListener("click", tambahTugas);
  inputTugas.addEventListener("keypress", (e) => {
    if (e.key === "Enter") tambahTugas();
  });

  // Fungsi untuk memuat tugas
  function muatTugas() {
    const tugasDisimpan = localStorage.getItem("tugas");
    if (tugasDisimpan) {
      tugas = JSON.parse(tugasDisimpan);
      tampilkanTugas();
    } else {
      tampilkanKosong();
    }
  }

  // Fungsi untuk menyimpan tugas ke localStorage
  function simpanTugas() {
    localStorage.setItem("tugas", JSON.stringify(tugas));
    perbaruiStatistik();
  }

  // Fungsi untuk menampilkan semua tugas
  function tampilkanTugas() {
    daftarTugas.innerHTML = "";

    if (tugas.length === 0) {
      tampilkanKosong();
      return;
    }

    tugas.forEach((tugasItem, index) => {
      const li = document.createElement("li");
      li.className = "tugas-item";
      li.dataset.id = index;

      li.innerHTML = `
      <div class="tugas-text ${tugasItem.selesai ? "tugas-selesai" : ""}">
        ${tugasItem.teks}
      </div>
      <div class="tugas-aksi">
        <button class="tombol-aksi tombol-selesai" title="Tandai Selesai">
          <i class="fas fa-check"></i>
        </button>
        <button class="tombol-aksi tombol-edit" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="tombol-aksi tombol-hapus" title="Hapus">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

      // Event listeners untuk aksi
      const tombolSelesai = li.querySelector(".tombol-selesai");
      const tombolEdit = li.querySelector(".tombol-edit");
      const tombolHapus = li.querySelector(".tombol-hapus");

      tombolSelesai.addEventListener("click", () => toggleSelesai(index));
      tombolEdit.addEventListener("click", () => editTugas(index));
      tombolHapus.addEventListener("click", () => hapusTugas(index));

      daftarTugas.appendChild(li);
    });
  }

  // Fungsi untuk menampilkan pesan kosong
  function tampilkanKosong() {
    daftarTugas.innerHTML = `
    <div class="tidak-ada-tugas">
      <i class="fas fa-tasks"></i>
      <p>Tidak ada tugas. Yuk tambahkan!</p>
    </div>
  `;
  }

  // Fungsi untuk menambah tugas baru
  function tambahTugas() {
    const teksTugas = inputTugas.value.trim();
    if (!teksTugas) {
      alert("Tugas tidak boleh kosong!");
      return;
    }

    tugas.push({
      teks: teksTugas,
      selesai: false,
      tanggalDibuat: new Date().toISOString(),
    });

    inputTugas.value = "";
    simpanTugas();
    tampilkanTugas();
  }

  // Fungsi untuk menandai tugas selesai/belum
  function toggleSelesai(index) {
    tugas[index].selesai = !tugas[index].selesai;
    simpanTugas();
    tampilkanTugas();
  }

  // Fungsi untuk mengedit tugas
  function editTugas(index) {
    const li = daftarTugas.querySelector(`li[data-id="${index}"]`);
    const teksTugas = li.querySelector(".tugas-text");
    const teksSekarang = tugas[index].teks;

    const input = document.createElement("input");
    input.type = "text";
    input.value = teksSekarang;
    input.classList.add("input-edit");

    li.replaceChild(input, teksTugas);
    input.focus();

    function simpanEdit() {
      const teksBaru = input.value.trim();
      if (teksBaru && teksBaru !== teksSekarang) {
        tugas[index].teks = teksBaru;
        simpanTugas();
      }
      tampilkanTugas();
    }

    input.addEventListener("blur", simpanEdit);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") simpanEdit();
    });
  }

  // Fungsi untuk menghapus tugas
  function hapusTugas(index) {
    // Animasi penghapusan
    const li = daftarTugas.querySelector(`li[data-id="${index}"]`);
    li.style.transform = "translateX(100%)";
    li.style.opacity = "0";

    setTimeout(() => {
      tugas.splice(index, 1);
      simpanTugas();
      tampilkanTugas();
    }, 300);
  }

  // Fungsi untuk memperbarui statistik
  function perbaruiStatistik() {
    const total = tugas.length;
    const selesai = tugas.filter((t) => t.selesai).length;

    totalTugasEl.textContent = `${total} ${
      total === 1 ? "tugas" : "tugas"
    }`;
    tugasSelesaiEl.textContent = `${selesai} selesai`;
  }
});