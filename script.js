// ------------------------
// Setup custom dropdown
// ------------------------
function setupDropdown(selectId, hiddenInputId, callback = null) {
  const wrapper = document.getElementById(selectId);
  const selected = wrapper.querySelector(".selected");
  const options = wrapper.querySelector(".options");
  const hiddenInput = document.getElementById(hiddenInputId);

  selected.addEventListener("click", () => {
    options.classList.toggle("hidden");
  });

  options.querySelectorAll("div").forEach(opt => {
    opt.addEventListener("click", () => {
      selected.textContent = opt.textContent;
      hiddenInput.value = opt.textContent;
      options.classList.add("hidden");
      if (callback) callback(opt.textContent);
    });
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) options.classList.add("hidden");
  });
}

// ------------------------
// Setup dropdowns
// ------------------------
setupDropdown("kelasSelect", "kelasValue");
setupDropdown("kehadiranSelect", "kehadiranValue", (value) => {
  const hadirGroup = document.getElementById("hadirGroup");
  const izinGroup = document.getElementById("izinGroup");

  if (value === "Hadir") {
    hadirGroup.classList.remove("hidden");
    izinGroup.classList.add("hidden");
  } else if (value === "Izin") {
    izinGroup.classList.remove("hidden");
    hadirGroup.classList.add("hidden");
  } else {
    hadirGroup.classList.add("hidden");
    izinGroup.classList.add("hidden");
  }
});

// ------------------------
// Kode valid untuk hadir
// ------------------------
const kodeValid = ["ABC123", "XYZ789", "KIR2025"];

// ------------------------
// Element references
// ------------------------
const form = document.getElementById("presensiForm");
const submitBtn = document.getElementById("submitBtn");
const alertBox = document.getElementById("alertBox");

// ------------------------
// Fungsi alert animasi
// ------------------------
function showAlert(message, type = "success") {
  alertBox.textContent = message;
  alertBox.className = "alert " + type + " show";

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000);
}

// ------------------------
// Fungsi kirim data
// ------------------------
function sendData(dataObj) {
  submitBtn.innerHTML = '<span class="loader"></span> Mengirim...';
  submitBtn.disabled = true;

  fetch("https://script.google.com/macros/s/AKfycbzpaDuKRwEw1Oa4z_urM0mJ0OqMYOIgnfXSZyzPHVaKkmivZ-TQVLsvpy31W7cOwLBoRA/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataObj)
  })
  .finally(() => {
    setTimeout(() => {
      submitBtn.innerHTML = "Kirim";
      submitBtn.disabled = false;
      showAlert("✅ Presensi berhasil dikirim!", "success");
      resetForm();
    }, 1200);
  });
}

// ------------------------
// Reset form
// ------------------------
function resetForm() {
  form.reset();
  document.getElementById("kelasSelect").querySelector(".selected").textContent = "-- Pilih Kelas --";
  document.getElementById("kelasValue").value = "";
  document.getElementById("kehadiranSelect").querySelector(".selected").textContent = "-- Pilih Kehadiran --";
  document.getElementById("kehadiranValue").value = "";
  document.getElementById("hadirGroup").classList.add("hidden");
  document.getElementById("izinGroup").classList.add("hidden");
}

// ------------------------
// Form submit logic
// ------------------------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const kelas = document.getElementById("kelasValue").value;
  const kehadiran = document.getElementById("kehadiranValue").value;
  const tanggal = document.getElementById("tanggal").value;
  const alasan = document.getElementById("alasan").value.trim();
  const pemateri = document.getElementById("pemateri").value.trim();
  const kodeHarian = document.getElementById("kodeHarian").value.trim();

  // Validasi wajib
  if (!nama) { showAlert("❌ Isi nama!", "error"); return; }
  if (!kelas) { showAlert("❌ Pilih kelas!", "error"); return; }
  if (!kehadiran) { showAlert("❌ Pilih kehadiran!", "error"); return; }
  if (!tanggal) { showAlert("❌ Pilih tanggal!", "error"); return; }

  // Flow Izin: wajib isi alasan
  if (kehadiran === "Izin") {
    if (!alasan) { showAlert("❌ Tuliskan alasan izin!", "error"); return; }
    sendData({ nama, kelas, kehadiran, alasan, tanggal });
    return;
  }

  // Flow Hadir: wajib kode harian dan valid
  if (kehadiran === "Hadir") {
    if (!kodeHarian) { showAlert("❌ Masukkan kode harian!", "error"); return; }
    if (!kodeValid.includes(kodeHarian)) { showAlert("❌ Kode harian salah!", "error"); return; }
    sendData({ nama, kelas, kehadiran, pemateri, kodeHarian, tanggal });
    return;
  }
});