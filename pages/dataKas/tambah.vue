<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <h2 class="text-center my-4">Bayar Uang Kas Digital PPLG 4</h2>
        <form @submit.prevent="kirimData">
          <!-- Pilih Nama Siswa -->
          <div class="row d-flex justify-content-center">
            <div class="mb-3 col-lg-6">
              <select
                v-model="form.nama"
                class="form-control form-control-lg form-select rounded-3 mb-2"
              >
                <option value="">Pilih Nama...</option>
                <option v-for="(member, i) in members" :key="i" :value="member.id">
                  {{ member.nama }}
                </option>
              </select>
            </div>
          </div>

          <!-- Input Nominal -->
          <div class="row d-flex justify-content-center">
            <div class="mb-3 col-lg-6">
              <input
                v-model="form.jumlah"
                type="number"
                class="form-control form-control-lg rounded-3 mb-2"
                placeholder="Nominal Bayar:"
              />
            </div>
          </div>

          <!-- Pilihan Minggu -->
          <div class="row d-flex justify-content-center">
            <div class="mb-3 col-lg-6">
              <select
                v-model="form.minggu"
                class="form-control form-control-lg form-select rounded-3 mb-2"
              >
                <option value="">Pilih Minggu...</option>
                <option value="kas1">Minggu 1</option>
                <option value="kas2">Minggu 2</option>
                <option value="kas3">Minggu 3</option>
                <option value="kas4">Minggu 4</option>
              </select>
            </div>
          </div>

          <!-- Tombol Kirim -->
          <div class="row d-flex justify-content-center">
            <div class="col-lg-6">
              <button type="submit" class="btn btn-success btn-lg rounded-3 px-3">
                Kirim
              </button>
            </div>
          </div>

          <!-- Tombol Keluar -->
          <nuxt-link to="/home">
            <button class="btn btn-danger mt-3" type="button">Keluar</button>
          </nuxt-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSupabaseClient, useRouter } from "#imports";

const supabase = useSupabaseClient();
const router = useRouter();

const members = ref([]); // List of students
const form = ref({
  nama: "", // Student ID
  minggu: "", // Week column
  jumlah: "", // Amount
});

const getNama = async () => {
  try {
    const { data, error } = await supabase.from("siswa").select("id, nama");
    if (error) throw error;
    members.value = data;
  } catch (error) {
    console.error("Gagal mengambil data siswa:", error.message);
  }
};

const kirimData = async () => {
  // Validasi input
  if (!form.value.nama || !form.value.minggu || !form.value.jumlah) {
    alert("Semua field wajib diisi!");
    return;
  }

  // Map minggu ke kolom tabel
  const columnToUpdate = form.value.minggu;

  try {
    // Insert ke tabel 'masuk'
    const { error } = await supabase.from("masuk").insert([
      {
        nama_siswa: form.value.nama,
        jumlah: form.value.jumlah,
        kas1: form.value.jumlah,
        kas2: form.value.jumlah,
        kas3: form.value.jumlah,
        kas4: form.value.jumlah,
      },
    ]);

    if (error) throw error;

    // Notifikasi berhasil
    alert("Data berhasil disimpan!");
    router.push("/dataKas/");
  } catch (error) {
    console.error("Gagal menyimpan data:", error.message);
    alert("Terjadi kesalahan saat menyimpan data.");
  }
};


// Ambil data siswa saat halaman dimuat
onMounted(getNama);
</script>

<style scoped>
.btn-success {
  background-color: #000000;
}

input,
select {
  background: #d9d9d9;
}
</style>
