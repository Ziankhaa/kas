<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12">
                <h2 class="text-center my-4">RIWAYAT KAS KELUAR</h2>
                <form @submit.prevent="getdataKas">
                    <div class="my-3 text-muted"> Menampilkan {{ visitors.length }} dari {{ jumlah }}</div>
                    <table class="table">
                        <thead>
                            <tr>
                                <td>NO</td>
                                <td>NAMA</td>
                                <td>WAKTU</td>
                                <td>KEPERLUAN</td>
                                <td>NOMINAL</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(visitor, i) in visitors" :key="i">
                                <td>{{ i + 1 }}.</td>
                                <td>{{ visitor.siswa.nama }}</td>
                                <td>{{ visitor.tanggal }}</td>
                                <td>{{ visitor.keperluan }}</td>
                                <td>{{ formatCurrency(visitor.jumlah) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- Total jumlah keluar -->
                    <div class="text-end mt-3">
                        <h5>Total Kas Keluar: {{ formatCurrency(totalKeluar) }}</h5>
                    </div>
                </form>
                <nuxt-link to="/home">
                    <button type="submit" class="btn btn-dark btn-lg rounded-5 px-5">Kembali</button>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
const supabase = useSupabaseClient();

const visitors = ref([]);
const jumlah = ref(0);

// Mengambil data kas keluar
const getdataKas = async () => {
    const { data, error } = await supabase.from("keluar").select(`*, siswa(nama)`);
    if (data) visitors.value = data;
};

// Menghitung total jumlah data
const totaldataKas = async () => {
    const { data, count } = await supabase.from("keluar").select("*", { count: "exact" });
    if (data) jumlah.value = count;
};

// Menghitung total nominal kas keluar
const totalKeluar = computed(() => {
    return visitors.value.reduce((sum, record) => sum + (record.jumlah || 0), 0);
});

// Format mata uang
const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(value);
};

onMounted(() => {
    getdataKas();
    totaldataKas();
});
</script>
