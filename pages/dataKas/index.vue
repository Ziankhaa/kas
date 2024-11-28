<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12">
                <h2 class="text-center my-4">RIWAYAT TOTAL KAS PER SISWA</h2>

                

                <!-- Input untuk memilih minggu -->
                <div class="my-3">
                    <select 
                        v-model="selectedWeek"
                        class="form-select form-select-lg"
                    >
                        <option value="">Pilih Minggu</option>
                        <option value="kas1">Minggu 1</option>
                        <option value="kas2">Minggu 2</option>
                        <option value="kas3">Minggu 3</option>
                        <option value="kas4">Minggu 4</option>
                    </select>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <td>NO</td>
                            <td>NAMA</td>
                            <td>TOTAL KAS</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(student, i) in filteredKasPerStudent" :key="i">
                            <td>{{ i + 1 }}.</td>
                            <td>{{ student.nama }}</td>
                            <td>{{ student.total }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Total Kas -->
                <div class="text-end fw-bold my-3">
                    Total Semua Kas Rp{{ totalKas }}
                </div>

                <nuxt-link to="/home">
                    <button class="btn btn-dark btn-lg rounded-5 px-5">Kembali</button>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
const supabase = useSupabaseClient();

const kasData = ref([]); // Data semua kas dari database
const selectedWeek = ref(''); // Minggu yang dipilih untuk filter
const totalKas = ref(0)

async function getTotalKas() {
    const { data, error } = await supabase
        .from('saldo_kas')
        .select('saldo')
        .single()
    if(data) totalKas.value = data.saldo
}

// Fungsi untuk mengambil data kas dari tabel `masuk`
const fetchAllKas = async () => {
    try {
        const { data, error } = await supabase
            .from('masuk')
            .select(`*, siswa(nama)`); // Mengambil data kas beserta nama siswa
        
        if (error) throw error;
        kasData.value = data;
    } catch (err) {
        console.error('Gagal mengambil data:', err.message);
    }
};

// Fungsi untuk memfilter data berdasarkan minggu tertentu
const filteredKasData = computed(() => {
    if (!selectedWeek.value) return kasData.value; // Jika minggu belum dipilih, tampilkan semua data

    return kasData.value.filter(item => {
        // Pastikan hanya data untuk minggu yang dipilih
        return item[selectedWeek.value] !== null && item[selectedWeek.value] !== undefined;
    });
});

// Menghitung total kas per siswa berdasarkan data yang difilter
const filteredKasPerStudent = computed(() => {
    const grouped = filteredKasData.value.reduce((acc, item) => {
        const name = item.siswa.nama;
        const totalKas = item[selectedWeek.value] || 0; // Ambil hanya kas sesuai minggu
        
        if (!acc[name]) {
            acc[name] = { nama: name, total: 0 };
        }
        acc[name].total += totalKas;
        
        return acc;
    }, {});

    // Konversi objek menjadi array
    return Object.values(grouped);
});

// Menghitung total dari semua kas pada data yang difilter
const totalFilteredKas = computed(() => {
    return filteredKasPerStudent.value.reduce((sum, student) => sum + student.total, 0);
});

// Ambil data saat komponen dimuat
onMounted(() => {
    fetchAllKas();
    getTotalKas();
});
</script>
