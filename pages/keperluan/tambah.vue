<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <h2 class="text-center my-4">Keperluan Kas PPLG 4</h2>
        <form @submit.prevent="kirimData">
          <div class="row d-flex justify-content-center">
            <div class="mb-3 col-lg-6">
              <select v-model="form.nama_siswa" class="form-control form-control-lg form-select rounded-3 mb-2">
                <option value="">Nama...</option>
                <option v-for="(member, i) in members" :key="i" :value="member.id">{{ member.nama }}</option>
              </select>
            </div>
          </div>
          <div class="row d-flex justify-content-center">
            <div class="mb-3 col-lg-6">
              <input v-model="form.keperluan" type="text" class="form-control form-control-lg form-select rounded-3 mb-2"
                placeholder="Keperluan...">
            </div>
          </div>
          <div class="row d-flex justify-content-center">
            <div class="mb-3 col-lg-6">
              <input v-model="form.jumlah" type="number" class="form-control form-control-lg form-select rounded-3 mb-2"
                placeholder="Nominal Bayar...">
            </div>
          </div>
          <div class="row d-flex justify-content-center">
            <div class="col-lg-6">
              <button type="submit" class="btn btn-success btn-lg rounded-3 px-3">Kirim</button>
            </div>
          </div>
          <nuxt-link to="/home">
            <button class="btn btn-danger mt-3">Keluar</button>
          </nuxt-link>
        </form>
        <!-- Tampilkan Total Kas -->
        <div class="text-center mt-4">
          <h4>Total Kas Terkumpul Rp{{ totalKas }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-success {
  background-color: #000000;
}

input {
  background: #D9D9D9;
}

select {
  background: #D9D9D9;
}
</style>

<script setup>
import { ref, onMounted } from "vue";
const supabase = useSupabaseClient();

const members = ref([]);
const totalKas = ref(0);

const form = ref({
  nama_siswa: "",
  keperluan: "",
  jumlah: "", // Nominal pengeluaran
});

const getTotalKas = async () => {
  const { data, error } = await supabase
    .from('saldo_kas')
    .select('saldo')
    .single()
  if(data) totalKas.value = data.saldo
    // const { data, error } = await supabase.from("masuk").select("jumlah");
  // if (error) {
  //   console.error("Gagal mengambil total kas:", error.message);
  //   return;
  // }

  // if (data && data.length > 0) {
  //   totalKas.value = data.reduce((sum, record) => sum + (record.jumlah || 0), 0);
  //   console.log("Total kas baru di UI:", totalKas.value);
  // } else {
  //   console.warn("Tidak ada data pada tabel 'masuk'.");
  //   totalKas.value = 0;
  // }
};


const kirimData = async () => {
  const nominal = parseInt(form.value.jumlah);

  if (isNaN(nominal) || nominal <= 0) {
    alert("Nominal harus diisi dengan angka yang valid.");
    return;
  }

  if (nominal > totalKas.value) {
    alert("Total kas tidak mencukupi untuk pengeluaran ini.");
    return;
  }

  // Kirim data ke tabel "keluar"
  const { error: insertError } = await supabase.from("keluar").insert([form.value]);
  if (insertError) {
    console.error("Gagal mengirim data ke tabel 'keluar':", insertError.message);
    return;
  }

  // Ambil data total kas dari tabel "masuk"
  const { data: masukData, error: masukError } = await supabase.from("masuk").select("id, jumlah").limit(1);
  if (masukError || !masukData.length) {
    console.error("Gagal mengambil data total kas:", masukError?.message);
    return;
  }

  const totalKasId = masukData[0].id;
  const currentTotalKas = masukData[0].jumlah;

  // Kurangi jumlah kas di tabel "masuk"
  const updatedKas = currentTotalKas - nominal;
  const { error: updateError } = await supabase
    .from("masuk")
    .update({ jumlah: updatedKas }) // Update total kas
    .eq("id", totalKasId); // ID yang tepat

  if (updateError) {
    console.error("Gagal memperbarui tabel 'masuk':", updateError.message);
    return;
  }

  console.log("Total kas berhasil diperbarui di database. Total kas baru:", updatedKas);

  // Perbarui UI dengan data terbaru
  await getTotalKas();  // Pastikan mengambil data terbaru setelah perubahan
  console.log("Total kas setelah update:", totalKas.value);

  alert("Data berhasil dikirim dan total kas diperbarui.");

  form.value = { nama_siswa: "", keperluan: "", jumlah: "" }; // Reset form
};



// Fungsi untuk mengambil nama siswa dari tabel "siswa"
const getNama = async () => {
  const { data, error } = await supabase.from("siswa").select("id, nama");
  if (error) {
    console.error("Gagal mengambil nama siswa:", error.message);
    return;
  }
  members.value = data;
};

// Panggil fungsi saat komponen dimuat
onMounted(() => {
  getNama();
  getTotalKas();
});
</script>
