import { DifficultyTier } from '../logic/physicsSolver';

export type AnimationMode =
  | 'single_slope_eq'
  | 'double_wedge_eq'
  | 'relative_slip'
  | 'liftoff_left'
  | 'friction_bounds'
  | 'recoil_cart'
  | 'pulley_resultant'
  | 'lab_velocity';

export interface StimulusConfig {
  variant: 'single_left' | 'double_wedge' | 'free_cart' | 'rough_left' | 'rough_both' | 'left_accel';
  alphaLabel: string;
  betaLabel?: string;
  alphaDeg: number;
  betaDeg?: number;
  m1Label: string;
  m2Label?: string;
  cartLabel?: string;
  accelDirection: 'right' | 'left' | 'free';
  accelLabel: string;
  forceLabel?: string;
  hasPulley: boolean;
  frictionNote: string;
  showVelocityFrame?: boolean;
}

export interface FbdForceVector {
  symbol: string;
  label: string;
  angleDeg: number; // math angle: 0 = right, 90 = up, 180 = left, 270 = down
  color: string;
  magnitudeScale: number;
}

export interface FbdConfig {
  frameDescription: string;
  axesDescription: string;
  alphaDeg: number;
  betaDeg?: number;
  forcesM1: FbdForceVector[];
  forcesM2?: FbdForceVector[];
  extraNote: string;
}

export interface AnimationParams {
  mode: AnimationMode;
  alphaDeg: number;
  betaDeg: number;
  aCart: number; // m/s^2 (positive right, negative left)
  g: number;
  m1: number;
  m2: number;
  M?: number;
  muS?: number;
  aRel: number; // m/s^2 along string (positive = m1 up-left, m2 up-left toward pulley; negative = m2 down-right)
  tensionN: number;
  normal1N: number;
  normal2N: number;
  stageNotes: [string, string, string];
}

export interface SolutionTenStages {
  tahap1Fenomena: string;
  tahap2Informasi: {
    diketahui: string[];
    ditanyakan: string;
    besaranDicari: string;
    informasiTambahan: string;
  };
  tahap3Model: string;
  tahap4VisualFbd: string;
  tahap5Prinsip: string;
  tahap6Penurunan: {
    langkah: string[];
    rumusUtama: {
      judul: string;
      latex: string;
      keterangan: Array<{ simbol: string; arti: string; satuan: string; kondisi: string }>;
    };
  };
  tahap7Substitusi: string[];
  tahap8HasilAkhir: {
    nilaiFormatKoma: string;
    satuan: string;
    catatanPembulatan: string;
  };
  tahap9Interpretasi: string;
  tahap10Kesimpulan: string;
}

export interface PhysicsProblem {
  id: number;
  tier: DifficultyTier;
  tierLabel: string;
  title: string;
  subtopic: string;
  questionText: string;
  unitLabel: string;
  answerExact: number;
  answerFormatted: string;
  stimulus: StimulusConfig;
  fbd: FbdConfig;
  animation: AnimationParams;
  solution: SolutionTenStages;
  narrator: {
    soalDanStimulus: string;
    fbdDanKonsep: string;
    langkahPembahasan: string;
    animasiDanInterpretasi: string;
  };
}

export const PROBLEMS: PhysicsProblem[] = [
  // =========================================================================
  // TIER 1: SOAL 1-3 (FONDASI KONSEP & PENERAPAN DASAR)
  // =========================================================================
  {
    id: 1,
    tier: 1,
    tierLabel: 'Fondasi Konsep',
    title: 'Kesetimbangan Relatif Balok Tunggal pada Lereng Kereta',
    subtopic: 'Gaya Fiktif dan Komponen Bidang Miring Tunggal',
    questionText:
      'Sebuah balok bermassa $m = 2{,}0\\text{ kg}$ diletakkan di atas lereng kiri sebuah kereta beroda yang permukaannya licin sempurna dengan sudut kemiringan $\\alpha$ terhadap horizontal ($\\sin \\alpha = 3/5$). Berbeda dengan sistem lengkap, kali ini balok tidak dihubungkan tali maupun katrol. Kereta kemudian didorong dengan percepatan konstan $a$ ke arah kanan. Gunakan $g = 10\\text{ m/s}^2$. Tentukan besar percepatan kereta $a$ (dalam $\\text{m/s}^2$) agar balok tepat diam relatif terhadap kereta!',
    unitLabel: 'm/s²',
    answerExact: 7.5,
    answerFormatted: '7,5',
    stimulus: {
      variant: 'single_left',
      alphaLabel: 'α (sin α = 3/5)',
      alphaDeg: 36.87,
      m1Label: 'm = 2,0 kg',
      accelDirection: 'right',
      accelLabel: 'a (kanan)',
      hasPulley: false,
      frictionNote: 'Permukaan lereng dan lantai licin sempurna (μ = 0)',
    },
    fbd: {
      frameDescription: 'Kerangka acuan non-inersia kereta (dipercepat ke kanan sebesar a)',
      axesDescription: 'Sumbu û sejajar lereng (ke atas-kiri), sumbu n̂ tegak lurus lereng (ke atas-kanan)',
      alphaDeg: 36.87,
      forcesM1: [
        { symbol: 'W = mg', label: 'Gaya berat vertikal ke bawah', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.0 },
        { symbol: 'N', label: 'Gaya normal tegak lurus lereng', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.25 },
        { symbol: 'F_fiktif = ma', label: 'Gaya fiktif ke arah kiri', angleDeg: 180, color: '#2563EB', magnitudeScale: 0.75 },
      ],
      extraNote: 'Tanpa tali, komponen gaya fiktif ma cos α ke atas-kiri harus mengimbangi tepat mg sin α ke bawah-kanan.',
    },
    animation: {
      mode: 'single_slope_eq',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: 7.5,
      g: 10,
      m1: 2.0,
      m2: 0,
      aRel: 0,
      tensionN: 0,
      normal1N: 25.0,
      normal2N: 0,
      stageNotes: [
        'Kereta mulai dipercepat ke kanan dengan a = 7,5 m/s².',
        'Komponen gaya fiktif ma cos α = 12,0 N tepat mengimbangi komponen berat mg sin α = 12,0 N.',
        'Balok tetap diam relatif terhadap lereng sementara kereta melaju semakin cepat terhadap lantai.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Saat kereta dipercepat ke kanan di atas lantai datar, balok di atas lereng kiri yang miring ke kanan-bawah akan terdorong ke arah kanan-bawah oleh gravitasi. Namun karena kereta dipercepat ke kanan, balok merasakan dorongan inersia (gaya fiktif) ke kiri yang cenderung menahannya naik ke atas lereng.',
      tahap2Informasi: {
        diketahui: [
          'Massa balok $m = 2{,}0\\text{ kg}$',
          'Sudut kemiringan lereng kiri $\\sin \\alpha = 3/5 \\implies \\cos \\alpha = 4/5$',
          'Permukaan lereng licin sempurna ($\\mu = 0$)',
          'Percepatan gravitasi $g = 10\\text{ m/s}^2$',
        ],
        ditanyakan: 'Percepatan horizontal kereta ke kanan $a$',
        besaranDicari: 'Besar percepatan kereta $a$ dalam satuan $\\text{m/s}^2$',
        informasiTambahan: 'Balok tidak terikat tali sehingga $T = 0$.',
      },
      tahap3Model:
        'Sistem dimodelkan sebagai partikel bermassa $m$ di atas bidang miring licin kaku. Kita memilih kerangka acuan non-inersia yang menempel pada kereta sehingga benda diam relatif ($\\vec{a}_{\\text{rel}} = 0$) dengan menambahkan gaya fiktif horizontal ke kiri sebesar $ma$.',
      tahap4VisualFbd:
        'Pada Diagram Benda Bebas balok bekerja tiga gaya dalam kerangka kereta: gaya berat $mg$ ke bawah, gaya normal $N$ tegak lurus keluar bidang, dan gaya fiktif $ma$ horizontal ke kiri. Proyeksi sejajar lereng menghasilkan komponen $-mg\\sin\\alpha$ menuju dasar lereng dan $+ma\\cos\\alpha$ menuju puncak kiri.',
      tahap5Prinsip:
        'Menggunakan syarat kesetimbangan statis ekuivalen dalam kerangka non-inersia: $\\sum F_{\\parallel,\\text{kereta}} = 0$.',
      tahap6Penurunan: {
        langkah: [
          'Proyeksikan seluruh gaya sepanjang sumbu sejajar bidang miring ($\\hat{u}$ ke atas-kiri):',
          '$\\sum F_u = ma\\cos\\alpha - mg\\sin\\alpha = 0$',
          'Pindahkan suku gravitasi ke ruas kanan dan bagi kedua ruas dengan $m\\cos\\alpha$:',
          '$a = g \\frac{\\sin\\alpha}{\\cos\\alpha} = g\\tan\\alpha$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: 'a = g \\tan\\alpha',
          keterangan: [
            { simbol: 'a', arti: 'Percepatan horizontal kereta ke kanan', satuan: 'm/s²', kondisi: 'Bidang miring licin tanpa tali' },
            { simbol: 'g', arti: 'Percepatan gravitasi bumi', satuan: 'm/s²', kondisi: 'Medan gravitasi seragam' },
            { simbol: '\\alpha', arti: 'Sudut lereng terhadap horizontal', satuan: 'rad / °', kondisi: '0° < α < 90°' },
          ],
        },
      },
      tahap7Substitusi: [
        'Dari segitiga siku-siku $3$-$4$-$5$, jika $\\sin\\alpha = 3/5$, maka $\\cos\\alpha = 4/5$, sehingga $\\tan\\alpha = \\frac{3/5}{4/5} = \\frac{3}{4} = 0{,}75$.',
        'Substitusikan nilai $g = 10\\text{ m/s}^2$:',
        '$a = 10 \\times \\frac{3}{4} = 7{,}5\\text{ m/s}^2$',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '7,5',
        satuan: 'm/s²',
        catatanPembulatan: 'Hasil eksak satu angka di belakang koma adalah 7,5.',
      },
      tahap9Interpretasi:
        'Nilai $7{,}5\\text{ m/s}^2$ merupakan percepatan ambang batas bagi lereng kiri. Pada Soal Nomor 5 asli, percepatan kereta diberikan $1{,}1g = 11\\text{ m/s}^2 > 7{,}5\\text{ m/s}^2$, itulah sebabnya $m_1$ terdorong naik ke kiri-atas dan membutuhkan tarikan tali $T$ agar tidak tergelincir naik!',
      tahap10Kesimpulan:
        'Strategi utama adalah menyamakan komponen gaya fiktif sejajar lereng dengan komponen gaya berat sejajar lereng; massa $m$ saling meniadakan karena keduanya sebanding dengan $m$.',
    },
    narrator: {
      soalDanStimulus:
        'Soal nomor satu membangun fondasi utama sebelum memahami Soal Nomor lima. Perhatikan gambar lereng tunggal bersudut alfa dengan sinus alfa tiga per lima tanpa tali penghubung.',
      fbdDanKonsep:
        'Pada diagram benda bebas dalam kerangka kereta, bekerja tiga gaya: berat ke bawah, gaya normal tegak lurus lereng, dan gaya fiktif ke arah kiri sebesar m kali a.',
      langkahPembahasan:
        'Dengan menyamakan komponen sejajar bidang, m a kosinus alfa sama dengan m g sinus alfa, sehingga percepatan keseimbangan adalah g tangen alfa sama dengan tujuh koma lima meter per sekon kuadrat.',
      animasiDanInterpretasi:
        'Amati animasi pembuktian: saat kereta dipercepat tepat tujuh koma lima meter per sekon kuadrat, balok bertahan diam terhadap lereng. Nilai inilah batas bawah percepatan sebelum tali pada Soal lima menjadi tegang.',
    },
  },
  {
    id: 2,
    tier: 1,
    tierLabel: 'Fondasi Konsep',
    title: 'Menentukan Gaya Normal Sebenarnya pada Kerangka Dipercepat',
    subtopic: 'Proyeksi Tegak Lurus Lereng dengan Pengaruh Gaya Fiktif',
    questionText:
      'Melanjutkan kondisi lereng kiri tanpa tali seperti Soal 1, sebuah balok bermassa $m_1 = 2{,}0\\text{ kg}$ diam relatif terhadap lereng kiri kereta yang bersudut $\\alpha$ ($\\sin \\alpha = 3/5$) saat kereta dipercepat ke kanan dengan $a = 7{,}5\\text{ m/s}^2$ ($g = 10\\text{ m/s}^2$). Hitung besar gaya normal $N_1$ (dalam Newton) yang dikerjakan permukaan lereng terhadap balok!',
    unitLabel: 'N',
    answerExact: 25.0,
    answerFormatted: '25,0',
    stimulus: {
      variant: 'single_left',
      alphaLabel: 'α (sin α = 3/5)',
      alphaDeg: 36.87,
      m1Label: 'm₁ = 2,0 kg',
      accelDirection: 'right',
      accelLabel: 'a = 7,5 m/s²',
      hasPulley: false,
      frictionNote: 'Permukaan lereng licin; balok diam relatif terhadap kereta',
    },
    fbd: {
      frameDescription: 'Kerangka non-inersia kereta (a = 7,5 m/s² ke kanan)',
      axesDescription: 'Fokus pada sumbu tegak lurus bidang miring n̂ (mengarah ke atas-kanan)',
      alphaDeg: 36.87,
      forcesM1: [
        { symbol: 'W = m₁g', label: 'Berat (20,0 N) → komponen tegak lurus -m₁g cos α', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.0 },
        { symbol: 'F_fiktif = m₁a', label: 'Gaya fiktif (15,0 N) → komponen tegak lurus -m₁a sin α', angleDeg: 180, color: '#2563EB', magnitudeScale: 0.75 },
        { symbol: 'N₁', label: 'Gaya normal keluar bidang (menekan ke atas-kanan)', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.25 },
      ],
      extraNote: 'Perhatikan bahwa gaya fiktif ke kiri ikut menekan balok lebih kuat ke permukaan lereng!',
    },
    animation: {
      mode: 'single_slope_eq',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: 7.5,
      g: 10,
      m1: 2.0,
      m2: 0,
      aRel: 0,
      tensionN: 0,
      normal1N: 25.0,
      normal2N: 0,
      stageNotes: [
        'Gaya berat 20 N dan gaya fiktif 15 N ke kiri sama-sama memiliki komponen menekan lereng.',
        'Resultan tekanan ke lereng: 16 N (dari berat) + 9 N (dari gaya fiktif) = 25,0 N.',
        'Dalam kerangka tanah, komponen horizontal N₁ sin α = 15 N tepat memberikan percepatan a = 7,5 m/s² pada m₁.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Banyak siswa mengira gaya normal pada bidang miring selalu bernilai $mg\\cos\\alpha$. Padahal saat kereta dipercepat ke kanan, dinding miring mendorong balok ikut melaju ke kanan, sehingga gaya normal $N_1$ harus lebih besar daripada berat komponen tegak lurus bidang.',
      tahap2Informasi: {
        diketahui: [
          'Massa balok $m_1 = 2{,}0\\text{ kg}$',
          '$\\sin\\alpha = 3/5 = 0{,}6$ dan $\\cos\\alpha = 4/5 = 0{,}8$',
          'Percepatan kereta ke kanan $a = 7{,}5\\text{ m/s}^2$',
          'Percepatan gravitasi $g = 10\\text{ m/s}^2$',
        ],
        ditanyakan: 'Besar gaya normal $N_1$',
        besaranDicari: 'Gaya normal dalam satuan Newton (N)',
        informasiTambahan: 'Tidak ada gerak relatif sepanjang maupun tegak lurus lereng.',
      },
      tahap3Model:
        'Balok dimodelkan dalam kesetimbangan pada arah tegak lurus permukaan lereng ($\\sum F_n = 0$). Kedua vektor (gravitasi ke bawah dan gaya fiktif ke kiri) diproyeksikan ke arah normal masuk ke bidang.',
      tahap4VisualFbd:
        'Dalam kerangka kereta, sudut antara gaya fiktif horizontal ke kiri dan bidang miring adalah $\\alpha$, sehingga komponen gaya fiktif yang menekan bidang ke dalam adalah $m_1 a \\sin\\alpha$. Komponen berat yang menekan bidang ke dalam adalah $m_1 g \\cos\\alpha$.',
      tahap5Prinsip:
        'Hukum I/II Newton pada sumbu tegak lurus bidang miring ($\\sum F_{\\perp} = 0$), atau ekuivalen dengan $\\sum F_y = 0$ di kerangka tanah ($N_1\\cos\\alpha = m_1 g$).',
      tahap6Penurunan: {
        langkah: [
          'Tulis kesetimbangan gaya tegak lurus lereng dalam kerangka kereta:',
          '$N_1 - m_1 g\\cos\\alpha - m_1 a\\sin\\alpha = 0$',
          '$N_1 = m_1(g\\cos\\alpha + a\\sin\\alpha)$',
          'Bandingkan dengan cara kerangka inersia tanah: karena tidak ada tali ($T=0$) dan percepatan vertikal nol, $\\sum F_y = N_1\\cos\\alpha - m_1 g = 0 \\implies N_1 = \\frac{m_1 g}{\\cos\\alpha}$.',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: 'N_1 = m_1(g\\cos\\alpha + a\\sin\\alpha)',
          keterangan: [
            { simbol: 'N_1', arti: 'Gaya normal permukaan lereng pada balok', satuan: 'N', kondisi: 'Kontak terjaga (N₁ > 0)' },
            { simbol: 'm_1 a \\sin\\alpha', arti: 'Tambahan tekanan akibat percepatan ke kanan', satuan: 'N', kondisi: 'Kereta dipercepat ke kanan' },
          ],
        },
      },
      tahap7Substitusi: [
        '$N_1 = 2{,}0 \\times (10 \\times 0{,}8 + 7{,}5 \\times 0{,}6)$',
        '$N_1 = 2{,}0 \\times (8{,}0 + 4{,}5) = 2{,}0 \\times 12{,}5 = 25{,}0\\text{ N}$',
        'Verifikasi silang kerangka tanah: $N_1 = \\frac{2{,}0 \\times 10}{0{,}8} = 25{,}0\\text{ N}$ (identik!).',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '25,0',
        satuan: 'N',
        catatanPembulatan: 'Hasil eksak ditampilkan satu angka desimal sebagai 25,0.',
      },
      tahap9Interpretasi:
        'Gaya normal $25{,}0\\text{ N}$ lebih besar daripada berat benda sendiri ($20{,}0\\text{ N}$) karena gaya normal harus sekaligus menopang berat benda secara vertikal dan mendorong benda ke kanan dengan gaya horizontal $N_1\\sin\\alpha = 25{,}0 \\times 0{,}6 = 15{,}0\\text{ N} = m_1 a$.',
      tahap10Kesimpulan:
        'Selalu sertakan komponen gaya fiktif $ma\\sin\\theta$ dalam perhitungan gaya normal apabila percepatan kerangka tidak sejajar bidang.',
    },
    narrator: {
      soalDanStimulus:
        'Pada soal nomor dua, kita melatih ketelitian menghitung gaya normal ketika kereta dipercepat ke kanan sebesar tujuh koma lima meter per sekon kuadrat.',
      fbdDanKonsep:
        'Hati-hati terhadap jebakan klasik! Gaya normal bukan sekadar m g kosinus alfa, karena gaya fiktif ke kiri turut menekan balok ke permukaan lereng sebesar m a sinus alfa.',
      langkahPembahasan:
        'Dengan menjumlahkan kedua komponen tekanan, N satu sama dengan dua dikali delapan ditambah empat koma lima, menghasilkan tepat dua puluh lima koma nol Newton.',
      animasiDanInterpretasi:
        'Perhatikan vektor gaya normal hijau pada animasi: proyeksi vertikalnya tepat menahan gaya berat dua puluh Newton, sedangkan proyeksi horizontalnya sebesar lima belas Newton mendorong balok ikut melaju ke kanan.',
    },
  },
  {
    id: 3,
    tier: 1,
    tierLabel: 'Fondasi Konsep',
    title: 'Tegangan Tali Sistem Dua Massa pada Kereta Soal 5',
    subtopic: 'Keseimbangan Tali Menghubungkan Lereng α dan Lereng β',
    questionText:
      'Kini dua balok $m_1 = 2{,}0\\text{ kg}$ dan $m_2 = 2{,}0\\text{ kg}$ dihubungkan oleh tali ringan melalui katrol licin tak bermassa di atas kereta licin seperti konfigurasi Soal Nomor 5. Diketahui sudut lereng kiri $\\alpha$ memenuhi $\\sin\\alpha = 3/5$ dan sudut lereng kanan $\\beta$ memenuhi $\\sin\\beta = 4/5$. Ketika kereta dipercepat ke kanan sebesar $a = 1{,}0g$ ($g = 10\\text{ m/s}^2$), kedua balok tetap diam relatif terhadap kereta. Hitung besar tegangan tali $T$ (dalam Newton)!',
    unitLabel: 'N',
    answerExact: 4.0,
    answerFormatted: '4,0',
    stimulus: {
      variant: 'double_wedge',
      alphaLabel: 'α (sin α = 3/5)',
      betaLabel: 'β (sin β = 4/5)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      m1Label: 'm₁ = 2,0 kg',
      m2Label: 'm₂ = 2,0 kg',
      accelDirection: 'right',
      accelLabel: 'a = 1,0g',
      hasPulley: true,
      frictionNote: 'Sistem tanpa gesekan; katrol & tali tak bermassa',
    },
    fbd: {
      frameDescription: 'Kerangka non-inersia kereta (a = 1,0g = 10 m/s² ke kanan)',
      axesDescription: 'Sumbu lereng masing-masing untuk m₁ (sudut α) dan m₂ (sudut β)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      forcesM1: [
        { symbol: 'm₁g', label: 'Berat m₁ (20 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.0 },
        { symbol: 'N₁', label: 'Gaya normal m₁', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.4 },
        { symbol: 'm₁a', label: 'Gaya fiktif ke kiri (20 N)', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.0 },
        { symbol: 'T', label: 'Tegangan tali menuju katrol', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.4 },
      ],
      forcesM2: [
        { symbol: 'm₂g', label: 'Berat m₂ (20 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.0 },
        { symbol: 'N₂', label: 'Gaya normal m₂', angleDeg: 36.87, color: '#059669', magnitudeScale: 1.4 },
        { symbol: 'm₂a', label: 'Gaya fiktif ke kiri (20 N)', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.0 },
        { symbol: 'T', label: 'Tegangan tali menuju katrol', angleDeg: 126.87, color: '#D97706', magnitudeScale: 0.4 },
      ],
      extraNote: 'Pada a = 1,0g, kecenderungan m₁ naik ke kiri-atas (0,2 mg) tepat sama dengan kecenderungan m₂ turun ke kanan-bawah (0,2 mg).',
    },
    animation: {
      mode: 'double_wedge_eq',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: 10.0,
      g: 10,
      m1: 2.0,
      m2: 2.0,
      aRel: 0,
      tensionN: 4.0,
      normal1N: 28.0,
      normal2N: 28.0,
      stageNotes: [
        'Kereta melaju ke kanan dengan percepatan tepat 1,0g = 10 m/s².',
        'm₁ menarik tali dengan gaya bersih 4,0 N ke kiri-atas; m₂ menarik tali dengan gaya bersih 4,0 N ke kanan-bawah.',
        'Tegangan tali stabil sebesar T = 4,0 N sehingga sistem tetap diam relatif terhadap kereta.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Ini adalah bentuk dasar utuh dari sistem Soal Nomor 5. Jika berdiri sendiri tanpa tali, $m_1$ akan terdorong naik ke kiri-atas karena $a = 10\\text{ m/s}^2 > 7{,}5\\text{ m/s}^2$, sedangkan $m_2$ akan meluncur turun ke kanan-bawah karena $\\beta = 53{,}13^\\circ$ cukup curam. Tali penghubung di antara keduanya menyalurkan tarikan saling menahan sehingga kedua benda diam relatif.',
      tahap2Informasi: {
        diketahui: [
          '$m_1 = m_2 = 2{,}0\\text{ kg}$',
          '$\\sin\\alpha = 3/5 = 0{,}6 \\implies \\cos\\alpha = 4/5 = 0{,}8$',
          '$\\sin\\beta = 4/5 = 0{,}8 \\implies \\cos\\beta = 3/5 = 0{,}6$',
          'Percepatan kereta ke kanan $a = 1{,}0g = 10\\text{ m/s}^2$',
        ],
        ditanyakan: 'Tegangan tali $T$',
        besaranDicari: 'Besar tegangan tali $T$ dalam Newton (N)',
        informasiTambahan: 'Katrol dan tali tak bermassa; gesekan diabaikan.',
      },
      tahap3Model:
        'Dalam kerangka kereta (non-inersia), kedua benda berada dalam keadaan diam relatif ($a_{\\text{rel}} = 0$). Tegangan tali $T$ seragam di sepanjang tali.',
      tahap4VisualFbd:
        'Untuk $m_1$: komponen gaya fiktif ke atas-kiri adalah $m_1 a\\cos\\alpha$, komponen berat ke bawah-kanan adalah $m_1 g\\sin\\alpha$, dan tegangan tali $T$ menarik ke bawah-kanan menuju katrol. Untuk $m_2$: komponen berat ke bawah-kanan adalah $m_2 g\\sin\\beta$, komponen gaya fiktif ke atas-kiri adalah $m_2 a\\cos\\beta$, dan tali $T$ menarik ke atas-kiri menuju katrol.',
      tahap5Prinsip:
        'Kesetimbangan gaya sejajar bidang miring pada kerangka non-inersia untuk masing-masing benda: $\\sum F_{\\parallel,1} = 0$ dan $\\sum F_{\\parallel,2} = 0$.',
      tahap6Penurunan: {
        langkah: [
          'Persamaan kesetimbangan $m_1$ sejajar lereng kiri:',
          '$m_1 a\\cos\\alpha - m_1 g\\sin\\alpha - T = 0 \\implies T = m_1(a\\cos\\alpha - g\\sin\\alpha)$',
          'Persamaan kesetimbangan $m_2$ sejajar lereng kanan (sebagai verifikasi konsistensi):',
          '$m_2 g\\sin\\beta - m_2 a\\cos\\beta - T = 0 \\implies T = m_2(g\\sin\\beta - a\\cos\\beta)$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: 'T = m_1(a\\cos\\alpha - g\\sin\\alpha) = m_2(g\\sin\\beta - a\\cos\\beta)',
          keterangan: [
            { simbol: 'T', arti: 'Tegangan tali penghubung kedua balok', satuan: 'N', kondisi: 'T > 0 (tali tegang)' },
            { simbol: 'a', arti: 'Percepatan horizontal kereta ke kanan', satuan: 'm/s²', kondisi: 'g tan α < a < g tan β' },
          ],
        },
      },
      tahap7Substitusi: [
        'Hitung dari persamaan $m_1$: $T = 2{,}0 \\times (10 \\times 0{,}8 - 10 \\times 0{,}6) = 2{,}0 \\times (8{,}0 - 6{,}0) = 4{,}0\\text{ N}$.',
        'Verifikasi silang dari persamaan $m_2$: $T = 2{,}0 \\times (10 \\times 0{,}8 - 10 \\times 0{,}6) = 2{,}0 \\times (8{,}0 - 6{,}0) = 4{,}0\\text{ N}$.',
        'Kedua persamaan memberikan nilai tegangan tali identik $4{,}0\\text{ N} > 0$, sehingga sistem benar-benar dalam kesetimbangan relatif.',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '4,0',
        satuan: 'N',
        catatanPembulatan: 'Hasil eksak ditulis dengan satu desimal menjadi 4,0.',
      },
      tahap9Interpretasi:
        'Tali memikul tepat $4{,}0\\text{ N}$ untuk menyalurkan kelebihan gaya fiktif pada $m_1$ guna menahan kelebihan komponen gravitasi pada $m_2$. Tanpa tali, kedua benda akan segera bergerak saling berlawanan arah relatif terhadap titik katrol.',
      tahap10Kesimpulan:
        'Selalu gunakan salah satu benda untuk menghitung $T$, lalu periksa kecocokan nilainya menggunakan benda kedua sebagai uji validasi.',
    },
    narrator: {
      soalDanStimulus:
        'Soal nomor tiga mempertemukan dua balok terhubung tali di atas kereta ganda seperti struktur Soal Nomor lima, dengan sudut sinus alfa tiga per lima dan sinus beta empat per lima.',
      fbdDanKonsep:
        'Perhatikan bahwa pada percepatan satu g ke kanan, balok m satu ingin meluncur naik menjauhi katrol, sedangkan balok m dua ingin meluncur turun menjauhi katrol. Jadi keduanya sama-sama menarik tali!',
      langkahPembahasan:
        'Dari persamaan m satu, tegangan tali T sama dengan dua dikali selisih delapan dan enam, yaitu empat koma nol Newton. Hasil dari m dua memberikan angka yang tepat sama.',
      animasiDanInterpretasi:
        'Animasi memperlihatkan vektor tegangan tali oranye di kedua lereng bernilai identik empat Newton, menahan sistem dalam keseimbangan sempurna selama kereta terus dipercepat.',
    },
  },

  // =========================================================================
  // TIER 2: SOAL 4-6 (PENERAPAN BEBERAPA TAHAPAN PERHITUNGAN)
  // =========================================================================
  {
    id: 4,
    tier: 2,
    tierLabel: 'Penerapan Bertahap',
    title: 'Penentuan Hubungan Sudut Lereng (Variasi Langsung Soal 5 OSK)',
    subtopic: 'Eliminasi Tegangan Tali untuk Relasi Sudut β',
    questionText:
      'Pada sistem kereta tanpa gesekan yang identik dengan Soal Nomor 5, diketahui sudut lereng kiri memenuhi $\\sin\\alpha = 3/5$. Ketika kereta diberikan percepatan konstan ke kanan sebesar $a = 1{,}4g$, ternyata baik $m_1$ maupun $m_2$ tidak bergerak relatif terhadap kereta. Anggap katrol dan tali tidak bermassa. Jika perbandingan massa $m_1 / m_2 = 1$, maka nilai dari $10\\sin\\beta - 14\\cos\\beta$ sama dengan ...',
    unitLabel: '(tak berdimensi)',
    answerExact: 5.2,
    answerFormatted: '5,2',
    stimulus: {
      variant: 'double_wedge',
      alphaLabel: 'α (sin α = 3/5)',
      betaLabel: 'β',
      alphaDeg: 36.87,
      betaDeg: 66.5,
      m1Label: 'm₁',
      m2Label: 'm₂ (m₁/m₂ = 1)',
      accelDirection: 'right',
      accelLabel: 'a = 1,4g',
      hasPulley: true,
      frictionNote: 'Tanpa gesekan; katrol dan tali tak bermassa',
    },
    fbd: {
      frameDescription: 'Kerangka non-inersia kereta (a = 1,4g ke kanan)',
      axesDescription: 'Proyeksi sejajar bidang pada masing-masing lereng α dan β',
      alphaDeg: 36.87,
      betaDeg: 66.5,
      forcesM1: [
        { symbol: 'm₁g', label: 'Berat m₁', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
        { symbol: 'N₁', label: 'Normal m₁', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.45 },
        { symbol: '1,4 m₁g', label: 'Gaya fiktif ke kiri', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.25 },
        { symbol: 'T', label: 'Tegangan tali menuju katrol', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.55 },
      ],
      forcesM2: [
        { symbol: 'm₂g', label: 'Berat m₂', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
        { symbol: 'N₂', label: 'Normal m₂', angleDeg: 23.5, color: '#059669', magnitudeScale: 1.45 },
        { symbol: '1,4 m₂g', label: 'Gaya fiktif ke kiri', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.25 },
        { symbol: 'T', label: 'Tegangan tali menuju katrol', angleDeg: 113.5, color: '#D97706', magnitudeScale: 0.55 },
      ],
      extraNote: 'Sudut β tidak diketahui eksplisit, melainkan dicari kombinasi linear 10 sin β − 14 cos β langsung dari eliminasi T.',
    },
    animation: {
      mode: 'double_wedge_eq',
      alphaDeg: 36.87,
      betaDeg: 66.5,
      aCart: 14.0,
      g: 10,
      m1: 1.0,
      m2: 1.0,
      aRel: 0,
      tensionN: 5.2,
      normal1N: 16.4,
      normal2N: 16.8,
      stageNotes: [
        'Dengan a = 1,4g, gaya fiktif ke kiri lebih besar daripada berat benda (1,4 mg).',
        'Agar m₂ tidak ikut terdorong naik menuju katrol, lereng kanan β harus cukup curam (≈ 66,5°).',
        'Tegangan tali T = 0,52 mg menyeimbangkan kedua lereng sekaligus menentukan 10 sin β − 14 cos β = 5,2.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Soal ini mereplikasi langsung struktur penalaran Soal Nomor 5 OSK 2026 dengan percepatan lebih besar ($1{,}4g$). Semakin besar percepatan ke kanan, semakin kuat dorongan fiktif pada $m_1$ menjauhi katrol, sehingga lereng kanan $\\beta$ harus semakin curam agar $m_2$ mampu mengimbangi tarikan tali tersebut.',
      tahap2Informasi: {
        diketahui: [
          '$\\sin\\alpha = 3/5 = 0{,}6 \\implies \\cos\\alpha = 4/5 = 0{,}8$',
          'Percepatan kereta ke kanan $a = 1{,}4g$',
          'Rasio massa $m_1 / m_2 = 1 \\implies m_1 = m_2 = m$',
        ],
        ditanyakan: 'Nilai aljabar $10\\sin\\beta - 14\\cos\\beta$',
        besaranDicari: 'Konstanta tak berdimensi hasil eliminasi kesetimbangan',
        informasiTambahan: 'Tidak ada gesekan; tali dan katrol tak bermassa.',
      },
      tahap3Model:
        'Kita menggunakan kerangka non-inersia kereta di mana kedua benda diam relatif ($a_{\\text{rel}} = 0$). Karena $m_1 = m_2 = m$ dan percepatan sebanding dengan $g$, faktor $m$ dan $g$ akan saling meniadakan.',
      tahap4VisualFbd:
        'Pada $m_1$: gaya fiktif $1{,}4 mg$ ke kiri menghasilkan proyeksi naik sebesar $1{,}4 mg\\cos\\alpha$ dan komponen berat turun sebesar $mg\\sin\\alpha$. Pada $m_2$: komponen berat turun sebesar $mg\\sin\\beta$ dan proyeksi fiktif naik sebesar $1{,}4 mg\\cos\\beta$.',
      tahap5Prinsip:
        'Kesetimbangan gaya sejajar lereng dengan tegangan tali yang sama besar ($T_1 = T_2 = T > 0$).',
      tahap6Penurunan: {
        langkah: [
          'Dari kesetimbangan $m_1$ sejajar lereng kiri: $T = m(1{,}4g\\cos\\alpha - g\\sin\\alpha)$',
          'Dari kesetimbangan $m_2$ sejajar lereng kanan: $T = m(g\\sin\\beta - 1{,}4g\\cos\\beta)$',
          'Samakan kedua ekspresi $T$ dan coret faktor $mg$:',
          '$\\sin\\beta - 1{,}4\\cos\\beta = 1{,}4\\cos\\alpha - \\sin\\alpha$',
          'Kalikan kedua ruas dengan bilangan $10$ untuk memunculkan koefisien bulat:',
          '$10\\sin\\beta - 14\\cos\\beta = 14\\cos\\alpha - 10\\sin\\alpha$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: '10\\sin\\beta - 14\\cos\\beta = 14\\cos\\alpha - 10\\sin\\alpha',
          keterangan: [
            { simbol: '10\\sin\\beta - 14\\cos\\beta', arti: 'Kelipatan 10 dari tegangan tali ternormalisasi T/(mg)', satuan: '-', kondisi: 'm₁ = m₂ dan a = 1,4g' },
            { simbol: '\\alpha', arti: 'Sudut lereng kiri', satuan: 'rad / °', kondisi: 'sin α = 3/5' },
          ],
        },
      },
      tahap7Substitusi: [
        'Substitusikan $\\cos\\alpha = 0{,}8$ dan $\\sin\\alpha = 0{,}6$:',
        '$10\\sin\\beta - 14\\cos\\beta = 14(0{,}8) - 10(0{,}6)$',
        '$= 11{,}2 - 6{,}0 = 5{,}2$',
        'Uji keberadaan sudut $\\beta$: amplitudo maksimum $10\\sin\\beta - 14\\cos\\beta$ adalah $\\sqrt{10^2 + 14^2} = \\sqrt{296} \\approx 17{,}2 > 5{,}2$, serta bernilai positif untuk sudut lancip $\\beta \\approx 66{,}5^\\circ$, dan $T = 0{,}52\\,mg > 0$.',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '5,2',
        satuan: '(tanpa satuan)',
        catatanPembulatan: 'Hasil eksak satu angka di belakang koma adalah 5,2.',
      },
      tahap9Interpretasi:
        'Bentuk pertanyaan $10\\sin\\beta - 14\\cos\\beta$ secara harfiah merepresentasikan $10\\times(T/mg)$. Nilai $5{,}2$ bermakna tegangan tali di dalam sistem sama dengan $0{,}52$ kali berat masing-masing balok.',
      tahap10Kesimpulan:
        'Saat menjumpai soal OSK dengan kombinasi $A\\sin\\beta - B\\cos\\beta$, periksa langsung koefisien pada persamaan kesetimbangan $T_1 = T_2$; kombinasi tersebut muncul alami tanpa menghitung sudut $\\beta$ secara terpisah.',
    },
    narrator: {
      soalDanStimulus:
        'Soal nomor empat merupakan saudara kembar langsung dari Soal Nomor lima OSK dua ribu dua puluh enam, dengan percepatan kereta diubah menjadi satu koma empat g.',
      fbdDanKonsep:
        'Jangan mencoba mencari nilai sudut beta dengan kalkulator! Perhatikan bahwa perbandingan koefisien sepuluh dan empat belas berasal dari perkalian sepuluh terhadap satu dan satu koma empat.',
      langkahPembahasan:
        'Eliminasi tegangan tali menghasilkan sepuluh sinus beta minus empat belas kosinus beta sama dengan empat belas kosinus alfa minus sepuluh sinus alfa, yaitu sebelas koma dua dikurangi enam sama dengan lima koma dua.',
      animasiDanInterpretasi:
        'Pada animasi, lereng kanan tampak jauh lebih curam daripada Soal sebelumnya agar gravitasi mampu mengimbangi gaya fiktif yang besar. Tegangan tali bernilai nol koma lima dua m g.',
    },
  },
  {
    id: 5,
    tier: 2,
    tierLabel: 'Penerapan Bertahap',
    title: 'Kesetimbangan Relatif dengan Massa Tidak Sama',
    subtopic: 'Menentukan Percepatan Kritis untuk Rasio Massa Berbeda',
    questionText:
      'Pada sistem kereta tanpa gesekan dengan konfigurasi Soal Nomor 5, diketahui $\\sin\\alpha = 3/5$ dan $\\sin\\beta = 4/5$. Kali ini kedua massa tidak sama, yaitu $m_1 = 2{,}0\\text{ kg}$ dan $m_2 = 4{,}0\\text{ kg}$. Gunakan percepatan gravitasi $g = 9{,}8\\text{ m/s}^2$. Tentukan besar percepatan kereta ke kanan $a$ (dalam $\\text{m/s}^2$) agar kedua balok tepat diam relatif terhadap kereta!',
    unitLabel: 'm/s²',
    answerExact: 10.78,
    answerFormatted: '10,8',
    stimulus: {
      variant: 'double_wedge',
      alphaLabel: 'α (sin α = 3/5)',
      betaLabel: 'β (sin β = 4/5)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      m1Label: 'm₁ = 2,0 kg',
      m2Label: 'm₂ = 4,0 kg',
      accelDirection: 'right',
      accelLabel: 'a (kanan)',
      hasPulley: true,
      frictionNote: 'Permukaan licin; g = 9,8 m/s²',
    },
    fbd: {
      frameDescription: 'Kerangka non-inersia kereta (percepatan a ke kanan)',
      axesDescription: 'Sumbu sejajar lereng untuk m₁ = 2 kg dan m₂ = 4 kg',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      forcesM1: [
        { symbol: 'm₁g', label: 'Berat m₁ (19,6 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.8 },
        { symbol: 'N₁', label: 'Normal m₁', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.1 },
        { symbol: 'm₁a', label: 'Gaya fiktif m₁ (21,56 N)', angleDeg: 180, color: '#2563EB', magnitudeScale: 0.9 },
        { symbol: 'T', label: 'Tegangan tali', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.45 },
      ],
      forcesM2: [
        { symbol: 'm₂g', label: 'Berat m₂ (39,2 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.3 },
        { symbol: 'N₂', label: 'Normal m₂', angleDeg: 36.87, color: '#059669', magnitudeScale: 1.7 },
        { symbol: 'm₂a', label: 'Gaya fiktif m₂ (43,12 N)', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.4 },
        { symbol: 'T', label: 'Tegangan tali', angleDeg: 126.87, color: '#D97706', magnitudeScale: 0.45 },
      ],
      extraNote: 'Karena m₂ lebih berat (2 kali m₁), tarikan gravitasi di kanan lebih dominan sehingga diperlukan a > 1,0g.',
    },
    animation: {
      mode: 'double_wedge_eq',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: 10.78,
      g: 9.8,
      m1: 2.0,
      m2: 4.0,
      aRel: 0,
      tensionN: 5.488,
      normal1N: 28.616,
      normal2N: 58.016,
      stageNotes: [
        'Massa m₂ = 4,0 kg dua kali lebih berat daripada m₁ = 2,0 kg.',
        'Percepatan a = 1,1g = 10,78 m/s² memberi tambahan dorongan fiktif ke kiri untuk mengimbangi tarikan m₂.',
        'Pada kondisi ini, tegangan tali di kiri dan kanan tepat seimbang sebesar T ≈ 5,49 N.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Pada Soal 3 dengan $m_1 = m_2$, kesetimbangan terjadi pada $a = 1{,}0g$. Jika $m_2$ digandakan menjadi $4{,}0\\text{ kg}$, tarikan ke kanan-bawah menjadi jauh lebih kuat. Untuk mencegah $m_2$ meluncur turun dan menarik $m_1$ melewati katrol, kereta harus dipercepat lebih tinggi agar gaya fiktif ke kiri membantu menahan $m_2$ sekaligus memperkuat tarikan $m_1$.',
      tahap2Informasi: {
        diketahui: [
          '$m_1 = 2{,}0\\text{ kg}$, $m_2 = 4{,}0\\text{ kg}$',
          '$\\sin\\alpha = 0{,}6 \\implies \\cos\\alpha = 0{,}8$',
          '$\\sin\\beta = 0{,}8 \\implies \\cos\\beta = 0{,}6$',
          '$g = 9{,}8\\text{ m/s}^2$',
        ],
        ditanyakan: 'Percepatan horizontal kereta $a$',
        besaranDicari: 'Percepatan $a$ dalam satuan $\\text{m/s}^2$',
        informasiTambahan: 'Kedua massa diam relatif terhadap kereta dan tali tetap tegang.',
      },
      tahap3Model:
        'Dalam kerangka non-inersia kereta, resultan gaya sejajar lereng pada $m_1$ dan $m_2$ bernilai nol dengan besar tegangan tali $T$ yang sama.',
      tahap4VisualFbd:
        'Gaya fiktif bekerja sebanding dengan massa masing-masing ($m_1 a$ dan $m_2 a$) ke arah kiri. Faktor massa tidak lagi saling mencoret secara langsung, melainkan berperan sebagai pembobot koefisien.',
      tahap5Prinsip:
        'Kesetimbangan relatif sistem dua benda terkopel: $T_1 = T_2 = T$.',
      tahap6Penurunan: {
        langkah: [
          'Dari $m_1$: $T = m_1(a\\cos\\alpha - g\\sin\\alpha)$',
          'Dari $m_2$: $T = m_2(g\\sin\\beta - a\\cos\\beta)$',
          'Eliminasi $T$ dan kumpulkan suku yang mengandung $a$ di ruas kiri:',
          '$(m_1\\cos\\alpha + m_2\\cos\\beta)a = (m_1\\sin\\alpha + m_2\\sin\\beta)g$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: 'a = g \\frac{m_1\\sin\\alpha + m_2\\sin\\beta}{m_1\\cos\\alpha + m_2\\cos\\beta}',
          keterangan: [
            { simbol: 'a', arti: 'Percepatan keseimbangan relatif unik', satuan: 'm/s²', kondisi: 'Bidang licin dan α < β' },
            { simbol: 'm_1, m_2', arti: 'Massa di lereng kiri dan kanan', satuan: 'kg', kondisi: 'Tali tegang (T > 0)' },
          ],
        },
      },
      tahap7Substitusi: [
        'Hitung pembilang: $m_1\\sin\\alpha + m_2\\sin\\beta = 2{,}0(0{,}6) + 4{,}0(0{,}8) = 1{,}2 + 3{,}2 = 4{,}4\\text{ kg}$.',
        'Hitung penyebut: $m_1\\cos\\alpha + m_2\\cos\\beta = 2{,}0(0{,}8) + 4{,}0(0{,}6) = 1{,}6 + 2{,}4 = 4{,}0\\text{ kg}$.',
        'Rasio $a/g = 4{,}4 / 4{,}0 = 1{,}1$.',
        'Kalikan dengan $g = 9{,}8\\text{ m/s}^2$: $a = 1{,}1 \\times 9{,}8 = 10{,}78\\text{ m/s}^2$.',
        'Cek syarat tali tegang: $T = 2{,}0(1{,}1\\times 0{,}8 - 0{,}6)g = 0{,}56g > 0$ (valid!).',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '10,8',
        satuan: 'm/s²',
        catatanPembulatan: 'Nilai eksak 10,78 dibulatkan menjadi satu angka di belakang koma yaitu 10,8.',
      },
      tahap9Interpretasi:
        'Perhatikan bahwa nilai $a = 1{,}1g$ berada tepat di dalam rentang aman $(g\\tan\\alpha, g\\tan\\beta) = (0{,}75g,\\ 1{,}33g)$. Seandainya $m_2$ terus diperbesar mendekati tak hingga, $a$ mendekati batas atas $g\\tan\\beta = 1{,}33g$.',
      tahap10Kesimpulan:
        'Rumus rasio berbobot untuk $a_{\\text{eq}}$ selalu berlaku untuk sebarang pasangan massa selama syarat $g\\tan\\alpha < a_{\\text{eq}} < g\\tan\\beta$ terpenuhi.',
    },
    narrator: {
      soalDanStimulus:
        'Pada soal nomor lima, massa tidak lagi sama: m satu dua kilogram sedangkan m dua empat kilogram, dengan gravitasi sembilan koma delapan meter per sekon kuadrat.',
      fbdDanKonsep:
        'Karena m dua lebih berat, kita memerlukan percepatan kereta yang lebih besar dari satu g agar gaya fiktif mampu menahan tarikan gravitasi dari lereng kanan.',
      langkahPembahasan:
        'Pembilang menghasilkan empat koma empat, penyebut menghasilkan empat koma nol, sehingga rasio percepatan terhadap g adalah satu koma satu. Dikalikan sembilan koma delapan menghasilkan sepuluh koma tujuh delapan, dibulatkan menjadi sepuluh koma delapan.',
      animasiDanInterpretasi:
        'Simulasi menunjukkan bahwa dengan m dua dua kali m satu, titik keseimbangan bergeser ke percepatan sepuluh koma delapan meter per sekon kuadrat dan tali tetap tegang.',
    },
  },
  {
    id: 6,
    tier: 2,
    tierLabel: 'Penerapan Bertahap',
    title: 'Gaya Dorong Eksternal Total untuk Mempertahankan Kesetimbangan',
    subtopic: 'Hukum II Newton Sistem Gabungan (Kereta + Dua Balok)',
    questionText:
      'Sebuah kereta bermassa $M = 12{,}0\\text{ kg}$ membawa dua balok $m_1 = 2{,}0\\text{ kg}$ (pada lereng kiri dengan $\\sin\\alpha = 3/5$) dan $m_2 = 2{,}0\\text{ kg}$ (pada lereng kanan dengan $\\sin\\beta = 4/5$) seperti sistem Soal Nomor 5. Seluruh permukaan lereng maupun lantai mendatar dianggap licin sempurna ($g = 9{,}8\\text{ m/s}^2$). Berapakah besar gaya dorong horizontal konstan $F$ (dalam Newton) yang harus diberikan pada kereta ke arah kanan agar $m_1$ dan $m_2$ tidak bergerak relatif terhadap kereta?',
    unitLabel: 'N',
    answerExact: 156.8,
    answerFormatted: '156,8',
    stimulus: {
      variant: 'double_wedge',
      alphaLabel: 'α (sin α = 3/5)',
      betaLabel: 'β (sin β = 4/5)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      m1Label: 'm₁ = 2,0 kg',
      m2Label: 'm₂ = 2,0 kg',
      cartLabel: 'M = 12,0 kg',
      accelDirection: 'right',
      accelLabel: 'a (kanan)',
      forceLabel: 'F',
      hasPulley: true,
      frictionNote: 'Lantai dan lereng licin; g = 9,8 m/s²',
    },
    fbd: {
      frameDescription: 'Analisis gabungan: (1) Kerangka kereta untuk mencari a; (2) Kerangka tanah untuk sistem total M + m₁ + m₂',
      axesDescription: 'Sumbu horizontal x terhadap lantai untuk gaya eksternal F',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      forcesM1: [
        { symbol: 'm₁g', label: 'Berat m₁', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
        { symbol: 'N₁', label: 'Normal m₁', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.25 },
        { symbol: 'm₁a', label: 'Gaya fiktif m₁', angleDeg: 180, color: '#2563EB', magnitudeScale: 0.9 },
        { symbol: 'T', label: 'Tegangan tali', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.35 },
      ],
      forcesM2: [
        { symbol: 'm₂g', label: 'Berat m₂', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
        { symbol: 'N₂', label: 'Normal m₂', angleDeg: 36.87, color: '#059669', magnitudeScale: 1.25 },
        { symbol: 'm₂a', label: 'Gaya fiktif m₂', angleDeg: 180, color: '#2563EB', magnitudeScale: 0.9 },
        { symbol: 'T', label: 'Tegangan tali', angleDeg: 126.87, color: '#D97706', magnitudeScale: 0.35 },
      ],
      extraNote: 'Karena m₁ dan m₂ diam terhadap kereta, ketiga benda bergerak bersama sebagai satu benda tegar dengan percepatan a.',
    },
    animation: {
      mode: 'double_wedge_eq',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: 9.8,
      g: 9.8,
      m1: 2.0,
      m2: 2.0,
      M: 12.0,
      aRel: 0,
      tensionN: 3.92,
      normal1N: 27.44,
      normal2N: 27.44,
      stageNotes: [
        'Gaya eksternal F = 156,8 N mendorong massa total (12 + 2 + 2 = 16 kg) dengan a = 9,8 m/s².',
        'Di dalam sistem, gaya normal dan tali menjadi gaya internal yang saling meniadakan (pasangan aksi-reaksi).',
        'Balok m₁ dan m₂ ikut terakselerasi ke kanan pada a = 1,0g tanpa bergeser sedikit pun.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Dalam praktiknya, percepatan kereta $a$ dihasilkan oleh gaya eksternal horizontal $F$ yang mendorong badan kereta. Karena $m_1$ dan $m_2$ diam relatif terhadap kereta, seluruh sistem yang terdiri atas kereta dan kedua balok memiliki percepatan horizontal yang sama persis terhadap lantai.',
      tahap2Informasi: {
        diketahui: [
          'Massa kereta $M = 12{,}0\\text{ kg}$',
          'Massa balok $m_1 = 2{,}0\\text{ kg}$ dan $m_2 = 2{,}0\\text{ kg}$',
          '$\\sin\\alpha = 0{,}6$, $\\sin\\beta = 0{,}8$',
          '$g = 9{,}8\\text{ m/s}^2$',
        ],
        ditanyakan: 'Gaya dorong horizontal $F$ pada kereta',
        besaranDicari: 'Besar gaya eksternal $F$ dalam Newton (N)',
        informasiTambahan: 'Tidak ada gesekan antara roda kereta dengan lantai.',
      },
      tahap3Model:
        'Tahap pertama menentukan percepatan keseimbangan $a$ melalui analisis kerangka kereta. Tahap kedua memandang $(M + m_1 + m_2)$ sebagai satu sistem komposit dalam kerangka inersia tanah.',
      tahap4VisualFbd:
        'Dalam diagram sistem komposit, gaya normal $N_1, N_2$, tegangan tali $T$, serta gaya reaksi katrol merupakan gaya internal yang berpasangan aksi-reaksi sehingga tidak muncul pada persamaan horizontal total sistem.',
      tahap5Prinsip:
        'Kesetimbangan relatif internal untuk memperoleh $a$, dilanjutkan Hukum II Newton untuk sistem total: $\\sum F_{x,\\text{eksternal}} = (M + m_1 + m_2) a$.',
      tahap6Penurunan: {
        langkah: [
          'Hitung percepatan keseimbangan $a$:',
          '$a = g \\frac{m_1\\sin\\alpha + m_2\\sin\\beta}{m_1\\cos\\alpha + m_2\\cos\\beta}$',
          'Terapkan Hukum II Newton horizontal untuk sistem total:',
          '$F = (M + m_1 + m_2) a$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: 'F = (M + m_1 + m_2)\\, g \\frac{m_1\\sin\\alpha + m_2\\sin\\beta}{m_1\\cos\\alpha + m_2\\cos\\beta}',
          keterangan: [
            { simbol: 'F', arti: 'Gaya horizontal eksternal pada kereta', satuan: 'N', kondisi: 'Lantai datar licin' },
            { simbol: 'M', arti: 'Massa badan kereta dan katrol', satuan: 'kg', kondisi: 'Semua bagian bergerak seiring pada percepatan a' },
          ],
        },
      },
      tahap7Substitusi: [
        'Hitung $a$: $a = 9{,}8 \\times \\frac{2{,}0(0{,}6) + 2{,}0(0{,}8)}{2{,}0(0{,}8) + 2{,}0(0{,}6)} = 9{,}8 \\times \\frac{2{,}8}{2{,}8} = 9{,}8\\text{ m/s}^2$.',
        'Hitung massa total sistem: $M_{\\text{total}} = 12{,}0 + 2{,}0 + 2{,}0 = 16{,}0\\text{ kg}$.',
        'Hitung gaya dorong: $F = 16{,}0 \\times 9{,}8 = 156{,}8\\text{ N}$.',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '156,8',
        satuan: 'N',
        catatanPembulatan: 'Hasil eksak satu angka desimal adalah 156,8.',
      },
      tahap9Interpretasi:
        'Gaya $156{,}8\\text{ N}$ jauh lebih sederhana dihitung lewat pendekatan sistem total daripada menjumlahkan gaya-gaya internal pada dinding kereta. Seandainya diperiksa secara terpisah, kereta mengalami dorongan kiri dari $N_1\\sin\\alpha + N_2\\sin\\beta + T(\\cos\\beta - \\cos\\alpha)$ sebesar $(m_1+m_2)a = 39{,}2\\text{ N}$, menyisakan $156{,}8 - 39{,}2 = 117{,}6\\text{ N} = M a$ untuk mempercepat kereta sendiri!',
      tahap10Kesimpulan:
        'Menggabungkan analisis kerangka non-inersia (untuk kondisi internal) dengan sistem total inersia (untuk gaya eksternal) adalah teknik paling ringkas pada soal dinamika kereta.',
    },
    narrator: {
      soalDanStimulus:
        'Soal nomor enam menghubungkan dinamika internal di atas kereta dengan gaya eksternal F yang mendorong kereta bermassa dua belas kilogram.',
      fbdDanKonsep:
        'Begitu kedua balok diam relatif terhadap kereta, seluruh sistem tiga benda bergerak sebagai satu kesatuan tegar di kerangka lantai.',
      langkahPembahasan:
        'Pertama kita peroleh percepatan keseimbangan sebesar satu g, yaitu sembilan koma delapan meter per sekon kuadrat. Kemudian kita kalikan dengan massa total enam belas kilogram sehingga gaya F sama dengan seratus lima puluh enam koma delapan Newton.',
      animasiDanInterpretasi:
        'Lihat animasi: gaya eksternal F memacu kereta, dan seluruh gaya internal seperti normal serta tegangan tali hanya bertugas mendistribusikan percepatan sembilan koma delapan meter per sekon kuadrat ke m satu dan m dua.',
    },
  },

  // =========================================================================
  // TIER 3: SOAL 7-9 (ANALISIS HUBUNGAN ANTARBESARAN & KOMBINASI PRINSIP)
  // =========================================================================
  {
    id: 7,
    tier: 3,
    tierLabel: 'Analisis Hubungan Besaran',
    title: 'Perbandingan Jumlah Gaya Normal terhadap Berat Total Kedua Balok',
    subtopic: 'Analisis Vektor Normal dan Keseimbangan Vertikal',
    questionText:
      'Pada sistem kereta tanpa gesekan Soal Nomor 5, diketahui $\\sin\\alpha = 3/5$, $\\sin\\beta = 4/5$, dan kedua balok bermassa sama ($m_1 = m_2 = m$). Kereta dipercepat ke kanan sebesar $a = 1{,}0g$ sehingga kedua balok tetap diam relatif terhadap kereta. Jika $N_1$ dan $N_2$ berturut-turut adalah gaya normal pada $m_1$ dan $m_2$, tentukan nilai perbandingan $\\frac{N_1 + N_2}{m_1 g + m_2 g}$!',
    unitLabel: '(rasio)',
    answerExact: 1.4,
    answerFormatted: '1,4',
    stimulus: {
      variant: 'double_wedge',
      alphaLabel: 'α (sin α = 3/5)',
      betaLabel: 'β (sin β = 4/5)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      m1Label: 'm₁ = m',
      m2Label: 'm₂ = m',
      accelDirection: 'right',
      accelLabel: 'a = 1,0g',
      hasPulley: true,
      frictionNote: 'Sistem licin sempurna dalam kesetimbangan relatif',
    },
    fbd: {
      frameDescription: 'Kerangka kereta untuk melihat komponen tegak lurus lereng (N₁, N₂)',
      axesDescription: 'Sumbu tegak lurus masing-masing lereng n̂₁ dan n̂₂',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      forcesM1: [
        { symbol: 'mg', label: 'Berat (mg)', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.0 },
        { symbol: 'ma = mg', label: 'Gaya fiktif ke kiri (mg)', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.0 },
        { symbol: 'N₁', label: 'Normal 1 = 1,4 mg', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.4 },
      ],
      forcesM2: [
        { symbol: 'mg', label: 'Berat (mg)', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.0 },
        { symbol: 'ma = mg', label: 'Gaya fiktif ke kiri (mg)', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.0 },
        { symbol: 'N₂', label: 'Normal 2 = 1,4 mg', angleDeg: 36.87, color: '#059669', magnitudeScale: 1.4 },
      ],
      extraNote: 'Mengapa (N₁ + N₂) lebih besar daripada 2mg? Karena resultan normal harus menyuplai percepatan horizontal sekaligus menopang berat.',
    },
    animation: {
      mode: 'double_wedge_eq',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: 10.0,
      g: 10,
      m1: 1.0,
      m2: 1.0,
      aRel: 0,
      tensionN: 2.0,
      normal1N: 14.0,
      normal2N: 14.0,
      stageNotes: [
        'Gravitasi efektif dalam kerangka kereta memiliki besar g_eff = √(g² + a²) = √2 g ≈ 1,414g.',
        'Masing-masing gaya normal bernilai N₁ = 1,4 mg dan N₂ = 1,4 mg.',
        'Rasio jumlah gaya normal terhadap berat total kedua balok tepat sebesar 1,4.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Ketika sebuah benda berada diam di atas bidang miring tak dipercepat, gaya normalnya lebih kecil daripada berat ($mg\\cos\\theta < mg$). Namun ketika kereta dipercepat ke kanan, dorongan dinding bidang miring terhadap balok bertambah sehingga jumlah gaya normal justru melampaui berat total kedua benda.',
      tahap2Informasi: {
        diketahui: [
          '$m_1 = m_2 = m$',
          '$\\sin\\alpha = 0{,}6 \\implies \\cos\\alpha = 0{,}8$',
          '$\\sin\\beta = 0{,}8 \\implies \\cos\\beta = 0{,}6$',
          'Percepatan ke kanan $a = 1{,}0g$',
        ],
        ditanyakan: 'Rasio $\\frac{N_1 + N_2}{m_1 g + m_2 g}$',
        besaranDicari: 'Perbandingan tak berdimensi gaya normal total terhadap berat total',
        informasiTambahan: 'Sistem berada dalam kesetimbangan relatif (sudah terverifikasi pada Soal 3).',
      },
      tahap3Model:
        'Dalam kerangka non-inersia kereta, komponen gaya tegak lurus lereng pada masing-masing balok berjumlah nol. Tegangan tali sejajar bidang sehingga tidak memengaruhi gaya normal.',
      tahap4VisualFbd:
        'Baik pada $m_1$ maupun $m_2$, proyeksi gaya berat ke dalam lereng adalah $mg\\cos\\theta$ dan proyeksi gaya fiktif $ma$ ke dalam lereng adalah $ma\\sin\\theta$.',
      tahap5Prinsip:
        'Keseimbangan gaya pada sumbu normal ($\\sum F_n = 0$) untuk masing-masing massa.',
      tahap6Penurunan: {
        langkah: [
          '$N_1 = m_1(g\\cos\\alpha + a\\sin\\alpha)$',
          '$N_2 = m_2(g\\cos\\beta + a\\sin\\beta)$',
          'Karena $m_1 = m_2 = m$ dan $a = g$, jumlahkan keduanya lalu bagi dengan $2mg$:',
          '$\\frac{N_1 + N_2}{2mg} = \\frac{1}{2}\\left[(\\cos\\alpha + \\sin\\alpha) + (\\cos\\beta + \\sin\\beta)\\right]$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: '\\frac{N_1 + N_2}{m_1 g + m_2 g} = \\frac{(\\cos\\alpha + \\frac{a}{g}\\sin\\alpha) + (\\cos\\beta + \\frac{a}{g}\\sin\\beta)}{2}',
          keterangan: [
            { simbol: 'N_1, N_2', arti: 'Gaya normal pada lereng kiri dan kanan', satuan: 'N', kondisi: 'm₁ = m₂' },
            { simbol: 'a/g', arti: 'Rasio percepatan kereta terhadap gravitasi', satuan: '-', kondisi: 'Sistem setimbang relatif' },
          ],
        },
      },
      tahap7Substitusi: [
        'Hitung $N_1/(mg) = \\cos\\alpha + \\sin\\alpha = 0{,}8 + 0{,}6 = 1{,}4$.',
        'Hitung $N_2/(mg) = \\cos\\beta + \\sin\\beta = 0{,}6 + 0{,}8 = 1{,}4$.',
        'Rasio total $= \\frac{1{,}4 + 1{,}4}{2} = 1{,}4$.',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '1,4',
        satuan: '(tanpa satuan)',
        catatanPembulatan: 'Nilai eksak satu desimal adalah 1,4.',
      },
      tahap9Interpretasi:
        'Secara geometris menarik: medan gravitasi efektif di dalam kereta memiliki besar $g_{\\text{eff}} = \\sqrt{g^2 + g^2} = \\sqrt{2}g \\approx 1{,}414g$. Karena arah $\\vec{g}_{\\text{eff}}$ hampir tegak lurus lereng (membentuk sudut $45^\\circ$ sedangkan $\\alpha = 36{,}9^\\circ$ dan $\\beta = 53{,}1^\\circ$, selisih hanya $8{,}1^\\circ$), maka kedua gaya normal nyaris mencapai nilai maksimum $m g_{\\text{eff}}$ yaitu $1{,}4\\,mg$!',
      tahap10Kesimpulan:
        'Memeriksa gaya normal bukan hanya memastikan balok tidak lepas kontak, melainkan juga memperlihatkan bagaimana percepatan horizontal memperbesar tekanan mekanis di atas bidang miring.',
    },
    narrator: {
      soalDanStimulus:
        'Soal nomor tujuh menguji kedalaman pemahaman tentang hubungan gaya normal dan berat benda ketika sistem dipercepat horizontal.',
      fbdDanKonsep:
        'Ingat, gaya normal pada masing-masing lereng menerima sumbangan dari gaya berat dan gaya fiktif, yaitu m g kosinus sudut ditambah m a sinus sudut.',
      langkahPembahasan:
        'Karena sinus alfa nol koma enam dan sinus beta nol koma delapan, masing-masing gaya normal bernilai satu koma empat m g. Jadi perbandingan jumlah gaya normal terhadap berat total tepat satu koma empat.',
      animasiDanInterpretasi:
        'Perhatikan panjang panah gaya normal hijau pada simulasi yang lebih panjang daripada panah berat merah! Ini membuktikan secara visual bahwa percepatan ke kanan menambah tekanan ke dinding miring.',
    },
  },
  {
    id: 8,
    tier: 3,
    tierLabel: 'Analisis Hubungan Besaran',
    title: 'Percepatan Relatif Saat Kereta Dipacu Melebihi Kesetimbangan',
    subtopic: 'Dinamika Tak Setimbang ($a > a_{\\text{eq}}$) di Atas Kereta',
    questionText:
      'Pada sistem kereta tanpa gesekan Soal Nomor 5 ($\\sin\\alpha = 3/5$, $\\sin\\beta = 4/5$, $m_1 = m_2 = 2{,}0\\text{ kg}$), diketahui bahwa kesetimbangan relatif tercapai saat $a = 1{,}0g$. Kini kereta justru dipercepat lebih kuat ke kanan sebesar $a = 1{,}5g$ ($g = 10\\text{ m/s}^2$). Tentukan besar percepatan relatif balok terhadap permukaan kereta ($a_{\\text{rel}}$ dalam $\\text{m/s}^2$) sesaat setelah sistem dilepaskan!',
    unitLabel: 'm/s²',
    answerExact: 3.5,
    answerFormatted: '3,5',
    stimulus: {
      variant: 'double_wedge',
      alphaLabel: 'α (sin α = 3/5)',
      betaLabel: 'β (sin β = 4/5)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      m1Label: 'm₁ = 2,0 kg',
      m2Label: 'm₂ = 2,0 kg',
      accelDirection: 'right',
      accelLabel: 'a = 1,5g (> a_eq)',
      hasPulley: true,
      frictionNote: 'Sistem dilepas dari diam relatif; licin sempurna',
    },
    fbd: {
      frameDescription: 'Kerangka kereta (a = 15 m/s² ke kanan) dengan gerak relatif a_rel ke kiri-atas untuk m₁ dan ke kiri-atas (menuju katrol) untuk m₂',
      axesDescription: 'Arah percepatan relatif positif: m₁ menjauhi katrol, m₂ mendekati katrol',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      forcesM1: [
        { symbol: 'm₁g', label: 'Berat (20 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
        { symbol: 'N₁', label: 'Normal 1 (34 N)', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.5 },
        { symbol: 'm₁a', label: 'Gaya fiktif (30 N)', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.35 },
        { symbol: 'T', label: 'Tegangan tali (5,0 N)', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.4 },
      ],
      forcesM2: [
        { symbol: 'm₂g', label: 'Berat (20 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
        { symbol: 'N₂', label: 'Normal 2 (36 N)', angleDeg: 36.87, color: '#059669', magnitudeScale: 1.55 },
        { symbol: 'm₂a', label: 'Gaya fiktif (30 N)', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.35 },
        { symbol: 'T', label: 'Tegangan tali (5,0 N)', angleDeg: 126.87, color: '#D97706', magnitudeScale: 0.4 },
      ],
      extraNote: 'Karena a = 15 m/s² > a_eq = 10 m/s², m₁ tergelincir naik ke kiri-atas dan menarik m₂ naik menuju katrol!',
    },
    animation: {
      mode: 'relative_slip',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: 15.0,
      g: 10,
      m1: 2.0,
      m2: 2.0,
      aRel: 3.5,
      tensionN: 5.0,
      normal1N: 34.0,
      normal2N: 36.0,
      stageNotes: [
        'Percepatan kereta a = 15 m/s² melampaui percepatan setimbang 10 m/s².',
        'm₁ meluncur naik ke kiri-atas dengan a_rel = 3,5 m/s², menarik m₂ naik menuju katrol.',
        'Tegangan tali T = 5,0 N (> 0) memastikan tali tetap tegang selama proses peluncuran.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Apabila percepatan kereta ke kanan dibuat lebih besar daripada percepatan keseimbangan ($1{,}5g > 1{,}0g$), gaya fiktif ke kiri mendominasi. Akibatnya $m_1$ tidak lagi tertahan di tempatnya, melainkan mulai meluncur naik ke arah kiri-atas sambil menarik $m_2$ naik menuju puncak katrol.',
      tahap2Informasi: {
        diketahui: [
          '$m_1 = m_2 = 2{,}0\\text{ kg}$',
          '$\\sin\\alpha = 0{,}6$, $\\cos\\alpha = 0{,}8$',
          '$\\sin\\beta = 0{,}8$, $\\cos\\beta = 0{,}6$',
          'Percepatan kereta ke kanan $a = 1{,}5g = 15\\text{ m/s}^2$',
        ],
        ditanyakan: 'Percepatan relatif balok terhadap kereta $a_{\\text{rel}}$',
        besaranDicari: 'Besar percepatan relatif sepanjang lereng dalam $\\text{m/s}^2$',
        informasiTambahan: 'Panjang tali tetap sehingga percepatan relatif kedua balok bernilai sama besar.',
      },
      tahap3Model:
        'Misalkan perpindahan $m_1$ naik ke kiri-atas sejauh $\\Delta s$, maka $m_2$ naik menuju katrol sejauh $\\Delta s$ pula. Keduanya memiliki percepatan relatif skalar $a_{\\text{rel}} = \\ddot{s}$ dalam kerangka kereta.',
      tahap4VisualFbd:
        'Pada $m_1$ (arah gerak naik ke kiri-atas): gaya penggerak adalah $m_1(a\\cos\\alpha - g\\sin\\alpha)$ dan penghambat adalah $T$. Pada $m_2$ (arah gerak naik ke kiri-atas menuju katrol): $T$ dan $m_2 a\\cos\\beta$ searah gerak, sedangkan $m_2 g\\sin\\beta$ melawan gerak.',
      tahap5Prinsip:
        'Hukum II Newton pada kerangka non-inersia sepanjang kendala tali: $\\sum F_{\\text{gerak}} = m_i a_{\\text{rel}}$.',
      tahap6Penurunan: {
        langkah: [
          'Persamaan gerak $m_1$ (naik ke kiri-atas): $m_1(a\\cos\\alpha - g\\sin\\alpha) - T = m_1 a_{\\text{rel}}$',
          'Persamaan gerak $m_2$ (naik menuju katrol): $T + m_2(a\\cos\\beta - g\\sin\\beta) = m_2 a_{\\text{rel}}$',
          'Jumlahkan kedua persamaan untuk mengeliminasi tegangan tali $T$:',
          '$(m_1 + m_2) a_{\\text{rel}} = m_1(a\\cos\\alpha - g\\sin\\alpha) + m_2(a\\cos\\beta - g\\sin\\beta)$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: 'a_{\\text{rel}} = \\frac{m_1(a\\cos\\alpha - g\\sin\\alpha) + m_2(a\\cos\\beta - g\\sin\\beta)}{m_1 + m_2}',
          keterangan: [
            { simbol: 'a_{\\text{rel}}', arti: 'Percepatan relatif balok sepanjang lereng terhadap kereta', satuan: 'm/s²', kondisi: 'T > 0 dan kontak terjaga' },
            { simbol: 'm_1 + m_2', arti: 'Inersia total kedua balok yang terkopel tali', satuan: 'kg', kondisi: 'Katrol tak bermassa' },
          ],
        },
      },
      tahap7Substitusi: [
        'Suku $m_1$: $2{,}0 \\times (15 \\times 0{,}8 - 10 \\times 0{,}6) = 2{,}0 \\times (12 - 6) = +12{,}0\\text{ N}$.',
        'Suku $m_2$: $2{,}0 \\times (15 \\times 0{,}6 - 10 \\times 0{,}8) = 2{,}0 \\times (9 - 8) = +2{,}0\\text{ N}$.',
        'Total gaya pendorong relatif $= 12{,}0 + 2{,}0 = 14{,}0\\text{ N}$.',
        '$a_{\\text{rel}} = \\frac{14{,}0}{2{,}0 + 2{,}0} = 3{,}5\\text{ m/s}^2$.',
        'Cek tegangan tali: $T = m_1(a\\cos\\alpha - g\\sin\\alpha - a_{\\text{rel}}) = 2{,}0(6{,}0 - 3{,}5) = 5{,}0\\text{ N} > 0$ (tali tetap tegang!).',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '3,5',
        satuan: 'm/s²',
        catatanPembulatan: 'Hasil eksak satu desimal adalah 3,5.',
      },
      tahap9Interpretasi:
        'Perhatikan sesuatu yang menakjubkan: jika kereta didorong terlalu cepat ($a = 1{,}5g > g\\tan\\beta = 1{,}33g$), $m_2$ sendiri sebenarnya sudah mulai terdorong naik menuju katrol oleh gaya fiktif ($+2{,}0\\text{ N}$). Mengapa tali tetap tegang ($T = 5{,}0\\text{ N}$)? Karena $m_1$ ingin meluncur naik jauh lebih cepat ($6{,}0\\text{ m/s}^2$ jika terpisah) dibanding $m_2$ ($1{,}0\\text{ m/s}^2$ jika terpisah), sehingga $m_1$ menarik $m_2$ lewat tali!',
      tahap10Kesimpulan:
        'Ketika $a \\neq a_{\\text{eq}}$, selalu periksa nilai $T$ setelah menghitung $a_{\\text{rel}}$ untuk memastikan kedua balok memang bergerak bersama dengan tali tegang.',
    },
    narrator: {
      soalDanStimulus:
        'Soal nomor delapan menguji keadaan di luar titik kesetimbangan Soal lima. Sekarang kereta dipacu lebih kencang dengan percepatan satu koma lima g.',
      fbdDanKonsep:
        'Karena percepatan melebihi satu g, kedua benda tidak lagi diam, melainkan bergerak relatif ke kiri-atas: m satu menjauhi katrol dan m dua mendekati katrol.',
      langkahPembahasan:
        'Dengan menjumlahkan persamaan Hukum dua Newton untuk kedua massa, tegangan tali saling meniadakan. Total gaya penggerak empat belas Newton dibagi massa total empat kilogram menghasilkan percepatan relatif tiga koma lima meter per sekon kuadrat.',
      animasiDanInterpretasi:
        'Saksikan pada animasi: selagi kereta melaju cepat ke kanan, balok m satu merangkak naik ke puncak kiri sambil menarik m dua naik mendekati katrol dengan tegangan tali lima Newton.',
    },
  },
  {
    id: 9,
    tier: 3,
    tierLabel: 'Analisis Hubungan Besaran',
    title: 'Percepatan Berbalik Arah ke Kiri & Batas Kritis Lepas Kontak',
    subtopic: 'Syarat Gaya Normal N ≥ 0 pada Kerangka Terakselerasi ke Kiri',
    questionText:
      'Sistem kereta licin pada konfigurasi Soal Nomor 5 memiliki sudut lereng kiri $\\alpha$ ($\\tan\\alpha = 3/4$) dan sudut lereng kanan $\\beta$ ($\\tan\\beta = 5/4$), dengan massa $m_1 = 2{,}0\\text{ kg}$ dan $m_2 = 3{,}0\\text{ kg}$. Berbeda dengan soal semula, kini kereta dipercepat ke arah **kiri** dengan besar percepatan $a_{\\text{kiri}}$. Tentukan nilai rasio maksimum $a_{\\text{kiri}}/g$ sebelum salah satu balok mulai terangkat (lepas kontak) dari bidang miringnya!',
    unitLabel: '(rasio a_kiri / g)',
    answerExact: 0.8,
    answerFormatted: '0,8',
    stimulus: {
      variant: 'left_accel',
      alphaLabel: 'α (tan α = 3/4)',
      betaLabel: 'β (tan β = 5/4)',
      alphaDeg: 36.87,
      betaDeg: 51.34,
      m1Label: 'm₁ = 2,0 kg',
      m2Label: 'm₂ = 3,0 kg',
      accelDirection: 'left',
      accelLabel: 'a_kiri (kiri)',
      hasPulley: true,
      frictionNote: 'Kereta dipercepat ke KIRI; permukaan licin',
    },
    fbd: {
      frameDescription: 'Kerangka kereta yang dipercepat ke KIRI dengan a_kiri',
      axesDescription: 'Sumbu tegak lurus bidang miring n̂₁ dan n̂₂ untuk menguji syarat kontak N ≥ 0',
      alphaDeg: 36.87,
      betaDeg: 51.34,
      forcesM1: [
        { symbol: 'm₁g', label: 'Berat m₁ ke bawah', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.0 },
        { symbol: 'm₁a_kiri', label: 'Gaya fiktif ke KANAN', angleDeg: 0, color: '#2563EB', magnitudeScale: 0.8 },
        { symbol: 'N₁', label: 'Normal m₁ (mengecil)', angleDeg: 53.13, color: '#059669', magnitudeScale: 0.6 },
        { symbol: 'T', label: 'Tegangan tali', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.45 },
      ],
      forcesM2: [
        { symbol: 'm₂g', label: 'Berat m₂ ke bawah', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.0 },
        { symbol: 'm₂a_kiri', label: 'Gaya fiktif ke KANAN', angleDeg: 0, color: '#2563EB', magnitudeScale: 0.8 },
        { symbol: 'N₂ → 0', label: 'Normal m₂ tepat nol saat a_kiri = 0,8g', angleDeg: 38.66, color: '#059669', magnitudeScale: 0.25 },
        { symbol: 'T', label: 'Tegangan tali', angleDeg: 128.66, color: '#D97706', magnitudeScale: 0.45 },
      ],
      extraNote: 'Ketika kereta dipercepat ke kiri, gaya fiktif mengarah ke kanan sehingga komponen normalnya MENGURANGI gaya tekan terhadap bidang!',
    },
    animation: {
      mode: 'liftoff_left',
      alphaDeg: 36.87,
      betaDeg: 51.34,
      aCart: -8.0,
      g: 10,
      m1: 2.0,
      m2: 3.0,
      aRel: -6.1,
      tensionN: 4.5,
      normal1N: 6.4,
      normal2N: 0,
      stageNotes: [
        'Kereta dipercepat ke kiri dengan a_kiri = 0,8g.',
        'Gaya fiktif ke kanan mengangkat komponen normal N₂ hingga tepat menyentuh N₂ = 0 (ambang lepas kontak).',
        'Karena β > α, lereng kanan selalu lepas kontak lebih dulu daripada lereng kiri (N₁ masih 0,32 m₁g > 0).',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Pada Soal Nomor 5, percepatan ke kanan menekan kedua balok lebih erat ke lerengnya. Sebaliknya, jika kereta dipercepat ke **kiri**, maka gaya fiktif di kerangka kereta berarah ke **kanan**. Akibatnya kedua balok cenderung meluncur ke kanan sekaligus terangkat keluar dari permukaan miring.',
      tahap2Informasi: {
        diketahui: [
          '$\\tan\\alpha = 3/4 \\implies \\cot\\alpha = 4/3 \\approx 1{,}33$',
          '$\\tan\\beta = 5/4 \\implies \\cot\\beta = 4/5 = 0{,}8$',
          '$m_1 = 2{,}0\\text{ kg}$, $m_2 = 3{,}0\\text{ kg}$',
          'Kereta dipercepat ke kiri sebesar $a_{\\text{kiri}}$',
        ],
        ditanyakan: 'Rasio maksimum $a_{\\text{kiri}}/g$ sebelum ada balok yang lepas kontak',
        besaranDicari: 'Nilai kritis $a_{\\text{maks}}/g$',
        informasiTambahan: 'Tali sejajar lereng sehingga tegangan tali $T$ tidak memiliki komponen tegak lurus bidang selama balok masih menempel.',
      },
      tahap3Model:
        'Selama kedua balok masih menempel pada bidang miring datar, percepatan relatif tegak lurus bidang adalah nol ($a_{\\perp,\\text{rel}} = 0$), meskipun benda sedang meluncur sejajar bidang. Lepas kontak terjadi tepat ketika salah satu gaya normal mencapai nol ($N_i = 0$).',
      tahap4VisualFbd:
        'Gaya fiktif $m_i a_{\\text{kiri}}$ mengarah ke kanan, sehingga proyeksinya sepanjang sumbu normal luar ($\\hat{n}_i$) bernilai $+m_i a_{\\text{kiri}}\\sin\\theta_i$ (membantu mengangkat balok menjauhi lereng), melawan komponen berat $-m_i g\\cos\\theta_i$.',
      tahap5Prinsip:
        'Syarat kontak permukaan: $N_1 \\ge 0$ dan $N_2 \\ge 0$ dalam kerangka kereta.',
      tahap6Penurunan: {
        langkah: [
          'Untuk $m_1$: $N_1 = m_1(g\\cos\\alpha - a_{\\text{kiri}}\\sin\\alpha) \\ge 0 \\implies \\frac{a_{\\text{kiri}}}{g} \\le \\cot\\alpha$',
          'Untuk $m_2$: $N_2 = m_2(g\\cos\\beta - a_{\\text{kiri}}\\sin\\beta) \\ge 0 \\implies \\frac{a_{\\text{kiri}}}{g} \\le \\cot\\beta$',
          'Batas terketat ditentukan oleh nilai $\\cot\\theta$ yang lebih kecil (lereng yang lebih curam).',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: '\\left(\\frac{a_{\\text{kiri}}}{g}\\right)_{\\text{maks}} = \\min(\\cot\\alpha,\\ \\cot\\beta)',
          keterangan: [
            { simbol: 'a_{\\text{kiri}}', arti: 'Besar percepatan kereta ke arah kiri', satuan: 'm/s²', kondisi: 'Kedua lereng miring ke kanan' },
            { simbol: '\\cot\\theta', arti: 'Kebalikan tangen sudut lereng', satuan: '-', kondisi: 'Batas N = 0 sebelum melayang' },
          ],
        },
      },
      tahap7Substitusi: [
        'Batas untuk $m_1$: $a_{\\text{kiri}}/g \\le \\cot\\alpha = 4/3 \\approx 1{,}33$.',
        'Batas untuk $m_2$: $a_{\\text{kiri}}/g \\le \\cot\\beta = 4/5 = 0{,}8$.',
        'Karena $0{,}8 < 1{,}33$, balok $m_2$ mencapai $N_2 = 0$ lebih dahulu pada $a_{\\text{kiri}}/g = 0{,}8$.',
        'Cek apakah $m_1$ tetap tertarik oleh tali saat meluncur: pada $a_{\\text{kiri}} = 0{,}8g$, $m_2$ ditarik ke kanan-bawah lebih kuat per satuan massa dan massanya lebih besar, sehingga tali tetap tegang ($T > 0$) dan $N_1 > 0$.',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '0,8',
        satuan: '(rasio a_kiri / g)',
        catatanPembulatan: 'Hasil eksak satu desimal adalah 0,8.',
      },
      tahap9Interpretasi:
        'Lereng yang lebih curam ($\\beta > \\alpha$) selalu lebih rentan kehilangan kontak ketika kereta berakselerasi ke kiri. Pada $a_{\\text{kiri}} = 0{,}8g$, balok $m_2$ berada di ambang terangkat melayang dari lereng kanan.',
      tahap10Kesimpulan:
        'Perubahan arah percepatan kereta membalik arah gaya fiktif dan langsung memunculkan fenomena lepas kontak yang tidak terjadi saat kereta dipercepat ke kanan.',
    },
    narrator: {
      soalDanStimulus:
        'Soal nomor sembilan membalik arah percepatan kereta ke arah kiri! Pertanyaannya, seberapa besar percepatan ke kiri maksimum sebelum salah satu balok terangkat dari bidangnya?',
      fbdDanKonsep:
        'Ketika kereta dipercepat ke kiri, gaya fiktif mengarah ke kanan dan justru mengurangi gaya normal. Gaya normal akan menjadi nol ketika a kiri sama dengan g kotangen sudut lereng.',
      langkahPembahasan:
        'Untuk m satu batasnya kotangen alfa sama dengan empat per tiga, sedangkan untuk m dua batasnya kotangen beta sama dengan empat per lima atau nol koma delapan. Nilai terkecilnya adalah nol koma delapan.',
      animasiDanInterpretasi:
        'Perhatikan vektor normal N dua pada animasi yang menyusut hingga lenyap di batas nol koma delapan g, sementara balok meluncur cepat ke arah kanan.',
    },
  },

  // =========================================================================
  // TIER 4: SOAL 10-12 (PROBLEM SOLVING MENENGAH-TINGGI)
  // =========================================================================
  {
    id: 10,
    tier: 4,
    tierLabel: 'Menengah-Tinggi',
    title: 'Percepatan Maksimum dengan Gesekan Statis pada Satu Lereng',
    subtopic: 'Menggabungkan Gaya Fiktif, Gesekan Statis, dan Tegangan Tali',
    questionText:
      'Sistem kereta pada Soal Nomor 5 ($\\sin\\alpha = 3/5$, $\\sin\\beta = 4/5$, $m_1 = m_2 = 1{,}0\\text{ kg}$) dimodifikasi sehingga permukaan lereng kiri ($m_1$) kini kasar dengan koefisien gesekan statis $\\mu_s = 0{,}25$, sedangkan permukaan lereng kanan ($m_2$) tetap licin sempurna. Gunakan $g = 10\\text{ m/s}^2$. Tentukan percepatan kereta ke kanan **maksimum** $a_{\\text{maks}}$ (dalam $\\text{m/s}^2$) agar kedua balok tetap diam relatif terhadap kereta!',
    unitLabel: 'm/s²',
    answerExact: 12.8,
    answerFormatted: '12,8',
    stimulus: {
      variant: 'rough_left',
      alphaLabel: 'α (sin α = 3/5, μ_s = 0,25)',
      betaLabel: 'β (sin β = 4/5, licin)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      m1Label: 'm₁ = 1,0 kg',
      m2Label: 'm₂ = 1,0 kg',
      accelDirection: 'right',
      accelLabel: 'a_maks (kanan)',
      hasPulley: true,
      frictionNote: 'Lereng kiri kasar (μ_s = 0,25); lereng kanan licin',
    },
    fbd: {
      frameDescription: 'Kerangka kereta pada ambang percepatan maksimum a_maks ke kanan',
      axesDescription: 'Saat a mencapai batas atas, m₁ hampir tergelincir naik ke kiri-atas sehingga gaya gesek statis f_s mengarah ke kanan-bawah (menuju katrol)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      forcesM1: [
        { symbol: 'm₁g', label: 'Berat m₁ (10 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
        { symbol: 'N₁', label: 'Normal 1 (15,68 N)', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.35 },
        { symbol: 'm₁a', label: 'Gaya fiktif ke kiri (12,8 N)', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.15 },
        { symbol: 'T', label: 'Tegangan tali (0,32 N)', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.25 },
        { symbol: 'f_s = μ_s N₁', label: 'Gesekan statis maks ke bawah-kanan (3,92 N)', angleDeg: 323.13, color: '#7C3AED', magnitudeScale: 0.55 },
      ],
      forcesM2: [
        { symbol: 'm₂g', label: 'Berat m₂ (10 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
        { symbol: 'N₂', label: 'Normal 2 (16,24 N)', angleDeg: 36.87, color: '#059669', magnitudeScale: 1.4 },
        { symbol: 'm₂a', label: 'Gaya fiktif ke kiri (12,8 N)', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.15 },
        { symbol: 'T', label: 'Tegangan tali (0,32 N)', angleDeg: 126.87, color: '#D97706', magnitudeScale: 0.25 },
      ],
      extraNote: 'Perhatikan ketergantungan f_s = μ_s N₁ yang juga memuat percepatan a melalui suku m₁a sin α!',
    },
    animation: {
      mode: 'friction_bounds',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: 12.8,
      g: 10,
      m1: 1.0,
      m2: 1.0,
      muS: 0.25,
      aRel: 0,
      tensionN: 0.32,
      normal1N: 15.68,
      normal2N: 16.24,
      stageNotes: [
        'Pada a = 12,8 m/s², gaya gesek statis pada m₁ mencapai nilai maksimum f_s = 0,25 N₁ = 3,92 N ke arah katrol.',
        'Bersama tegangan tali kecil T = 0,32 N, gaya fiktif yang mendorong m₁ ke kiri-atas berhasil ditahan.',
        'Jika percepatan ditambah sedikit saja di atas 12,8 m/s², sistem langsung tergelincir ke kiri-atas.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Tanpa gesekan (Soal 3), sistem hanya setimbang pada satu nilai percepatan ($a = 10\\text{ m/s}^2$). Hadirnya gesekan statis di lereng kiri membuka suatu **rentang** percepatan $[a_{\\min}, a_{\\text{maks}}]$ di mana kedua balok tetap diam. Ketika $a$ diperbesar menuju batas atas $a_{\\text{maks}}$, $m_1$ cenderung meluncur naik menjauhi katrol, sehingga gaya gesek statis mengerahkan tarikan maksimumnya ke arah kanan-bawah (menuju katrol).',
      tahap2Informasi: {
        diketahui: [
          '$m_1 = m_2 = 1{,}0\\text{ kg}$',
          '$\\sin\\alpha = 0{,}6$, $\\cos\\alpha = 0{,}8$',
          '$\\sin\\beta = 0{,}8$, $\\cos\\beta = 0{,}6$',
          '$\\mu_s = 0{,}25$ pada lereng kiri saja; lereng kanan licin',
          '$g = 10\\text{ m/s}^2$',
        ],
        ditanyakan: 'Percepatan ke kanan maksimum $a_{\\text{maks}}$',
        besaranDicari: 'Nilai $a_{\\text{maks}}$ dalam $\\text{m/s}^2$',
        informasiTambahan: 'Gaya normal $N_1$ bergantung pada $a_{\\text{maks}}$.',
      },
      tahap3Model:
        'Pada keadaan batas kritis tepat akan bergerak ke kiri-atas, gaya gesek statis mencapai batas maksimum $f_{s,\\text{maks}} = \\mu_s N_1$ berarah menuju katrol (searah dengan $T$ dan $m_1 g\\sin\\alpha$).',
      tahap4VisualFbd:
        'Untuk $m_1$: $N_1 = m_1(g\\cos\\alpha + a\\sin\\alpha)$. Gaya pendorong ke atas-kiri $m_1 a\\cos\\alpha$ diimbangi oleh $m_1 g\\sin\\alpha + T + \\mu_s N_1$. Untuk $m_2$ (licin): $T = m_2(g\\sin\\beta - a\\cos\\beta)$.',
      tahap5Prinsip:
        'Kesetimbangan statis kritis pada kerangka non-inersia dengan batas hukum gesekan Coulomb $f_s = \\mu_s N_1$.',
      tahap6Penurunan: {
        langkah: [
          'Dari $m_1$: $T = m_1(a\\cos\\alpha - g\\sin\\alpha) - \\mu_s m_1(g\\cos\\alpha + a\\sin\\alpha)$',
          'Dari $m_2$: $T = m_2(g\\sin\\beta - a\\cos\\beta)$',
          'Samakan $T$ dan pisahkan suku $a$ dan suku $g$:',
          '$\\left[m_1(\\cos\\alpha - \\mu_s\\sin\\alpha) + m_2\\cos\\beta\\right] a_{\\text{maks}} = \\left[m_2\\sin\\beta + m_1(\\sin\\alpha + \\mu_s\\cos\\alpha)\\right] g$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: 'a_{\\text{maks}} = g \\frac{m_2\\sin\\beta + m_1(\\sin\\alpha + \\mu_s\\cos\\alpha)}{m_1(\\cos\\alpha - \\mu_s\\sin\\alpha) + m_2\\cos\\beta}',
          keterangan: [
            { simbol: 'a_{\\text{maks}}', arti: 'Percepatan batas atas kesetimbangan relatif', satuan: 'm/s²', kondisi: 'Gesekan di lereng kiri melawan gerak ke kiri-atas' },
            { simbol: '\\mu_s', arti: 'Koefisien gesekan statis lereng kiri', satuan: '-', kondisi: 'T ≥ 0 saat a = a_maks' },
          ],
        },
      },
      tahap7Substitusi: [
        'Hitung faktor penyebut untuk $m_1 = m_2 = 1{,}0\\text{ kg}$:',
        '$(0{,}8 - 0{,}25 \\times 0{,}6) + 0{,}6 = (0{,}8 - 0{,}15) + 0{,}6 = 0{,}65 + 0{,}60 = 1{,}25$.',
        'Hitung faktor pembilang:',
        '$0{,}8 + (0{,}6 + 0{,}25 \\times 0{,}8) = 0{,}8 + (0{,}6 + 0{,}20) = 1{,}60$.',
        '$a_{\\text{maks}} = 10 \\times \\frac{1{,}60}{1{,}25} = 10 \\times 1{,}28 = 12{,}8\\text{ m/s}^2$.',
        'Verifikasi syarat tali tegang: $T = 1{,}0 \\times (10 \\times 0{,}8 - 12{,}8 \\times 0{,}6) = 8{,}0 - 7{,}68 = 0{,}32\\text{ N} > 0$ (valid!).',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '12,8',
        satuan: 'm/s²',
        catatanPembulatan: 'Hasil eksak satu angka desimal adalah 12,8.',
      },
      tahap9Interpretasi:
        'Adanya gesekan statis $\\mu_s = 0{,}25$ memperluas batas kestabilan dari $10{,}0\\text{ m/s}^2$ menjadi $12{,}8\\text{ m/s}^2$. Penting diperhatikan bahwa tegangan tali turun drastis menjadi hanya $0{,}32\\text{ N}$ karena sebagian besar beban penahanan sudah diambil alih oleh gaya gesek pada lereng kiri.',
      tahap10Kesimpulan:
        'Saat menggabungkan gesekan dan percepatan kerangka, selalu masukkan suku $ma\\sin\\alpha$ ke dalam gaya normal $N_1$ sebelum menghitung $f_s = \\mu_s N_1$.',
    },
    narrator: {
      soalDanStimulus:
        'Soal nomor sepuluh menambahkan gesekan statis nol koma dua lima hanya pada lereng kiri, sehingga kesetimbangan berubah menjadi rentang percepatan.',
      fbdDanKonsep:
        'Untuk mencari batas atas percepatan maksimum, kita tinjau saat m satu hampir tergelincir naik ke kiri-atas. Oleh karena itu gaya gesek statis mengarah ke kanan-bawah menuju katrol.',
      langkahPembahasan:
        'Jangan lupa bahwa gaya normal N satu mengandung suku percepatan a. Dengan menyamakan tegangan tali, diperoleh satu koma dua lima a sama dengan enam belas, sehingga percepatan maksimum tepat dua belas koma delapan meter per sekon kuadrat.',
      animasiDanInterpretasi:
        'Perhatikan panah ungu gaya gesek statis pada animasi yang membantu tegangan tali menahan balok m satu. Nilai tegangan tali menyusut hingga nol koma tiga dua Newton dan tetap tegang.',
    },
  },
  {
    id: 11,
    tier: 4,
    tierLabel: 'Menengah-Tinggi',
    title: 'Gerak Bebas Kereta Tanpa Gaya Dorong (Dinamika Terkopel)',
    subtopic: 'Kekekalan Momentum Horizontal dan Percepatan Rekoil Kereta',
    questionText:
      'Kini kereta Soal Nomor 5 bermassa $M = 14{,}5\\text{ kg}$ diletakkan bebas di atas lantai datar licin tanpa gaya dorong eksternal apa pun. Di atas lereng licinnya ($\\sin\\alpha = 3/5$, $\\sin\\beta = 4/5$) terdapat balok $m_1 = 5{,}0\\text{ kg}$ dan $m_2 = 5{,}0\\text{ kg}$ yang awalnya ditahan diam, lalu dilepaskan bersamaan. Gunakan $g = 10\\text{ m/s}^2$. Tentukan besar percepatan horizontal kereta $a_M$ (dalam $\\text{m/s}^2$) akibat meluncurnya kedua balok!',
    unitLabel: 'm/s²',
    answerExact: 2.5,
    answerFormatted: '2,5',
    stimulus: {
      variant: 'free_cart',
      alphaLabel: 'α (sin α = 3/5)',
      betaLabel: 'β (sin β = 4/5)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      m1Label: 'm₁ = 5,0 kg',
      m2Label: 'm₂ = 5,0 kg',
      cartLabel: 'M = 14,5 kg',
      accelDirection: 'free',
      accelLabel: 'Kereta bebas bergerak (F_eks = 0)',
      hasPulley: true,
      frictionNote: 'Lantai & seluruh lereng licin; dilepas dari diam',
    },
    fbd: {
      frameDescription: 'Kombinasi kerangka kereta (bergerak ke KIRI dengan a_M) & kendala pusat massa horizontal konstan',
      axesDescription: 'Pusat massa sistem horizontal tetap diam → jika balok bergerak ke kanan relatif, kereta terdorong ke kiri!',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      forcesM1: [
        { symbol: 'm₁g', label: 'Berat m₁ (50 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.0 },
        { symbol: 'N₁', label: 'Normal 1 (32,5 N)', angleDeg: 53.13, color: '#059669', magnitudeScale: 0.9 },
        { symbol: 'm₁a_M', label: 'Gaya fiktif ke KANAN (12,5 N)', angleDeg: 0, color: '#2563EB', magnitudeScale: 0.45 },
        { symbol: 'T', label: 'Tegangan tali (3,75 N)', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.3 },
      ],
      forcesM2: [
        { symbol: 'm₂g', label: 'Berat m₂ (50 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.0 },
        { symbol: 'N₂', label: 'Normal 2 (20,0 N)', angleDeg: 36.87, color: '#059669', magnitudeScale: 0.7 },
        { symbol: 'm₂a_M', label: 'Gaya fiktif ke KANAN (12,5 N)', angleDeg: 0, color: '#2563EB', magnitudeScale: 0.45 },
        { symbol: 'T', label: 'Tegangan tali (3,75 N)', angleDeg: 126.87, color: '#D97706', magnitudeScale: 0.3 },
      ],
      extraNote: 'Karena β > α, kedua balok meluncur ke kanan-bawah di lerengnya masing-masing, sehingga kereta otomatis terdorong mundur ke KIRI.',
    },
    animation: {
      mode: 'recoil_cart',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: -2.5,
      g: 10,
      m1: 5.0,
      m2: 5.0,
      M: 14.5,
      aRel: -8.75,
      tensionN: 3.75,
      normal1N: 32.5,
      normal2N: 20.0,
      stageNotes: [
        'Tanpa gaya luar horizontal, sistem dilepaskan dari diam.',
        'm₂ turun ke kanan-bawah menarik m₁ menuju katrol (juga ke kanan-bawah) dengan a_rel = 8,75 m/s².',
        'Agar momentum total arah horizontal tetap nol, kereta bermassa 14,5 kg terdorong ke KIRI dengan a_M = 2,5 m/s².',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Berbeda dengan Soal 1–10 di mana percepatan kereta dipaksakan dari luar, kini kereta dibiarkan bebas di lantai licin. Karena kedua lereng miring menurun ke arah kanan, baik $m_1$ (menuju katrol) maupun $m_2$ (menjauhi katrol) meluncur ke kanan saat dilepas. Oleh aksi-reaksi gaya normal dan tali, kereta terdorong meluncur ke arah **kiri** agar pusat massa horizontal seluruh sistem tidak berpindah!',
      tahap2Informasi: {
        diketahui: [
          '$M = 14{,}5\\text{ kg}$, $m_1 = 5{,}0\\text{ kg}$, $m_2 = 5{,}0\\text{ kg}$',
          '$\\sin\\alpha = 0{,}6$, $\\cos\\alpha = 0{,}8$',
          '$\\sin\\beta = 0{,}8$, $\\cos\\beta = 0{,}6$',
          '$g = 10\\text{ m/s}^2$; lantai datar dan lereng licin',
        ],
        ditanyakan: 'Besar percepatan horizontal kereta $a_M$',
        besaranDicari: 'Magnitudo percepatan kereta $a_M$ dalam $\\text{m/s}^2$',
        informasiTambahan: 'Tidak ada gaya eksternal horizontal ($\\sum F_{x,\\text{eks}} = 0$).',
      },
      tahap3Model:
        'Tetapkan besar percepatan kereta ke kiri sebesar $a_M$, dan percepatan relatif balok sepanjang lereng (keduanya ke arah kanan-bawah) sebesar $a_{\\text{rel}}$. Dalam kerangka kereta yang dipercepat ke kiri, gaya fiktif berarah ke kanan ($+m_i a_M$).',
      tahap4VisualFbd:
        'Untuk $m_1$ yang turun menuju katrol: $T + m_1 g\\sin\\alpha + m_1 a_M\\cos\\alpha = m_1 a_{\\text{rel}}$. Untuk $m_2$ yang turun menjauhi katrol: $m_2 g\\sin\\beta + m_2 a_M\\cos\\beta - T = m_2 a_{\\text{rel}}$.',
      tahap5Prinsip:
        'Kombinasi Hukum II Newton dalam kerangka kereta dengan Kekekalan Momentum Horizontal (posisi pusat massa arah $x$ konstan).',
      tahap6Penurunan: {
        langkah: [
          'Dari kekekalan momentum horizontal ($\\sum P_x = 0 \\implies \\sum m_i a_{ix} = 0$):',
          '$-M a_M + m_1(a_{\\text{rel}}\\cos\\alpha - a_M) + m_2(a_{\\text{rel}}\\cos\\beta - a_M) = 0$',
          '$(M + m_1 + m_2) a_M = (m_1\\cos\\alpha + m_2\\cos\\beta) a_{\\text{rel}} \\implies a_{\\text{rel}} = \\frac{M_{\\text{tot}}}{C} a_M$',
          'Dengan menjumlahkan persamaan gerak relatif $m_1$ dan $m_2$ di kerangka kereta ($T$ tereliminasi):',
          '$(m_1 + m_2) a_{\\text{rel}} = S g + C a_M$, dengan $C = m_1\\cos\\alpha + m_2\\cos\\beta$ dan $S = m_1\\sin\\alpha + m_2\\sin\\beta$.',
          'Substitusikan $a_{\\text{rel}}$:',
          '$\\left[(m_1 + m_2) M_{\\text{tot}} - C^2\\right] a_M = S C g$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: 'a_M = \\frac{(m_1\\sin\\alpha + m_2\\sin\\beta)(m_1\\cos\\alpha + m_2\\cos\\beta)}{(m_1+m_2)(M+m_1+m_2) - (m_1\\cos\\alpha + m_2\\cos\\beta)^2}\\, g',
          keterangan: [
            { simbol: 'a_M', arti: 'Percepatan rekoil kereta ke arah kiri', satuan: 'm/s²', kondisi: 'Lantai licin tanpa gaya eksternal horizontal' },
            { simbol: 'M_{\\text{tot}}', arti: 'Massa total sistem M + m₁ + m₂', satuan: 'kg', kondisi: 'Kedua balok tetap di atas lereng' },
          ],
        },
      },
      tahap7Substitusi: [
        '$C = 5{,}0(0{,}8) + 5{,}0(0{,}6) = 4{,}0 + 3{,}0 = 7{,}0\\text{ kg}$.',
        '$S = 5{,}0(0{,}6) + 5{,}0(0{,}8) = 3{,}0 + 4{,}0 = 7{,}0\\text{ kg}$.',
        '$M_{\\text{tot}} = 14{,}5 + 5{,}0 + 5{,}0 = 24{,}5\\text{ kg}$; dan $m_1 + m_2 = 10{,}0\\text{ kg}$.',
        'Penyebut $= (10{,}0)(24{,}5) - (7{,}0)^2 = 245 - 49 = 196\\text{ kg}^2$.',
        'Pembilang $= (7{,}0)(7{,}0)(10) = 490\\text{ kg}^2\\cdot\\text{m/s}^2$.',
        '$a_M = \\frac{490}{196} = 2{,}5\\text{ m/s}^2$ (ke kiri).',
        'Uji konsistensi: $a_{\\text{rel}} = \\frac{24{,}5}{7{,}0}(2{,}5) = 8{,}75\\text{ m/s}^2$, menghasilkan $T = 3{,}75\\text{ N} > 0$, $N_1 = 32{,}5\\text{ N} > 0$, $N_2 = 20{,}0\\text{ N} > 0$.',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '2,5',
        satuan: 'm/s²',
        catatanPembulatan: 'Hasil eksak satu angka desimal adalah 2,5.',
      },
      tahap9Interpretasi:
        'Soal ini membalikkan peran sebab-akibat Soal Nomor 5: bukan kereta yang dipercepat untuk menahan balok, melainkan luncuran balok itu sendirilah yang mempercepat kereta ke kiri sebesar $2{,}5\\text{ m/s}^2$! Periksa gaya total pada kereta dari $N_1\\sin\\alpha + N_2\\sin\\beta + T(\\cos\\alpha - \\cos\\beta)$? Tepat $(32{,}5\\times 0{,}6) + (20\\times 0{,}8) + 3{,}75(0{,}8 - 0{,}6) = 19{,}5 + 16{,}0 + 0{,}75 = 36{,}25\\text{ N} = 14{,}5 \\times 2{,}5$!',
      tahap10Kesimpulan:
        'Penggabungan persamaan pusat massa horizontal dengan dinamika kerangka kereta langsung memberikan percepatan rekoil tanpa perlu memecahkan seluruh komponen normal satu per satu.',
    },
    narrator: {
      soalDanStimulus:
        'Soal nomor sebelas adalah pengembangan tingkat tinggi yang sangat terkenal di Olimpiade: kereta kini dibiarkan bebas di atas lantai licin tanpa gaya dorong luar!',
      fbdDanKonsep:
        'Ketika dilepaskan dari keadaan diam, m satu dan m dua meluncur menuruni lereng ke kanan. Agar pusat massa horizontal sistem tetap diam, kereta wajib meluncur mundur ke arah kiri.',
      langkahPembahasan:
        'Dengan menggabungkan kekekalan momentum arah x dan hukum Newton di kerangka kereta, pembilang menghasilkan empat ratus sembilan puluh dibagi penyebut seratus sembilan puluh enam, menghasilkan tepat dua koma lima meter per sekon kuadrat.',
      animasiDanInterpretasi:
        'Amati garis vertikal posisi pusat massa pada animasi: saat kedua balok turun ke kanan, kereta bergeser ke kiri sehingga pusat massa sistem tetap tidak berpindah secara horizontal.',
    },
  },
  {
    id: 12,
    tier: 4,
    tierLabel: 'Menengah-Tinggi',
    title: 'Resultan Gaya Tali pada Poros Katrol Kondisi Soal 5 Asli',
    subtopic: 'Penjumlahan Vektor Tegangan Tali pada Sudut Geometri Soal 5',
    questionText:
      'Kembali pada kondisi tepat **Soal Nomor 5 OSK 2026** ($\\sin\\alpha = 3/5$, kereta dipercepat ke kanan $a = 1{,}1g$, dan kedua balok bermassa sama $m_1 = m_2 = 5{,}0\\text{ kg}$ diam relatif terhadap kereta sehingga $10\\sin\\beta - 11\\cos\\beta = 2{,}8$). Gunakan $g = 10\\text{ m/s}^2$. Tentukan besar gaya total (resultan gaya) yang dikerjakan oleh kedua segmen tali terhadap katrol (dalam Newton)!',
    unitLabel: 'N',
    answerExact: 5.273,
    answerFormatted: '5,3',
    stimulus: {
      variant: 'double_wedge',
      alphaLabel: 'α (sin α = 3/5)',
      betaLabel: 'β (10 sin β − 11 cos β = 2,8)',
      alphaDeg: 36.87,
      betaDeg: 58.58,
      m1Label: 'm₁ = 5,0 kg',
      m2Label: 'm₂ = 5,0 kg',
      accelDirection: 'right',
      accelLabel: 'a = 1,1g',
      hasPulley: true,
      frictionNote: 'Sistem Soal 5 asli; cari resultan gaya pada katrol',
    },
    fbd: {
      frameDescription: 'Diagram vektor gaya khusus pada KATROL di titik puncak (sudut lereng α ≈ 36,87° dan β ≈ 58,58°)',
      axesDescription: 'Dua tarikan tali berbesar sama T = 14,0 N: segmen kiri ke arah (−cos α, +sin α) dan segmen kanan ke arah (+cos β, −sin β)',
      alphaDeg: 36.87,
      betaDeg: 58.58,
      forcesM1: [
        { symbol: 'T_kiri (14,0 N)', label: 'Tarikan segmen tali kiri sepanjang lereng α ke kiri-atas', angleDeg: 143.13, color: '#D97706', magnitudeScale: 1.3 },
        { symbol: 'T_kanan (14,0 N)', label: 'Tarikan segmen tali kanan sepanjang lereng β ke kanan-bawah', angleDeg: 301.42, color: '#D97706', magnitudeScale: 1.3 },
        { symbol: 'F_katrol (5,3 N)', label: 'Resultan T_kiri + T_kanan pada katrol', angleDeg: 222.27, color: '#2563EB', magnitudeScale: 0.6 },
      ],
      extraNote: 'Sudut apit antara kedua segmen tali adalah 180° − (β − α) ≈ 158,29° (hampir lurus!), sehingga resultannya jauh lebih kecil dari 2T.',
    },
    animation: {
      mode: 'pulley_resultant',
      alphaDeg: 36.87,
      betaDeg: 58.58,
      aCart: 11.0,
      g: 10,
      m1: 5.0,
      m2: 5.0,
      aRel: 0,
      tensionN: 14.0,
      normal1N: 73.0,
      normal2N: 68.6,
      stageNotes: [
        'Tegangan tali pada kondisi Soal 5 asli adalah T = 5,0 × (11×0,8 − 10×0,6) = 14,0 N.',
        'Karena lereng kiri naik dengan α ≈ 36,9° dan lereng kanan turun dengan β ≈ 58,6°, kedua tarikan hampir berlawanan arah.',
        'Resultan vektor kedua tarikan pada poros katrol bernilai F_katrol = 2T sin((β − α)/2) ≈ 5,3 N.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Katrol pada sudut puncak menyalurkan gaya tali kepada badan kereta melalui porosnya. Meskipun besar tegangan tali di kedua sisi katrol sama ($T = 14{,}0\\text{ N}$), arah kedua segmen tali tidak sama: segmen kiri mengarah ke kiri-atas (sudut $\\alpha$), sedangkan segmen kanan mengarah ke kanan-bawah (sudut $\\beta$). Gaya total tali pada katrol adalah penjumlahan vektor kedua tarikan tersebut.',
      tahap2Informasi: {
        diketahui: [
          '$\\sin\\alpha = 0{,}6 \\implies \\cos\\alpha = 0{,}8 \\implies \\alpha \\approx 36{,}870^\\circ$',
          '$a = 1{,}1g = 11\\text{ m/s}^2$, $g = 10\\text{ m/s}^2$',
          '$m_1 = m_2 = 5{,}0\\text{ kg}$',
          'Persamaan sudut kanan: $10\\sin\\beta - 11\\cos\\beta = 2{,}8$',
        ],
        ditanyakan: 'Besar resultan gaya tali pada katrol $F_{\\text{katrol}}$',
        besaranDicari: 'Magnitudo vektor $\\vec{T}_{\\text{kiri}} + \\vec{T}_{\\text{kanan}}$ dalam Newton (N)',
        informasiTambahan: 'Simpan seluruh presisi sudut $\\alpha$ dan $\\beta$ hingga langkah pembulatan akhir.',
      },
      tahap3Model:
        'Poros katrol menerima dua gaya berbesar $T$ dengan vektor satuan arah $\\hat{u}_1 = (-\\cos\\alpha,\\ +\\sin\\alpha)$ dan $\\hat{u}_2 = (+\\cos\\beta,\\ -\\sin\\beta)$.',
      tahap4VisualFbd:
        'Perhatikan bahwa apabila $\\alpha = \\beta$, maka $\\hat{u}_1 = -\\hat{u}_2$ (dua sisi membentuk satu garis lurus) sehingga gaya pada katrol nol. Di sini $\\beta > \\alpha$, sehingga selisih arah sebesar $\\Delta\\theta = \\beta - \\alpha$ menghasilkan gaya neto ke kiri-bawah.',
      tahap5Prinsip:
        'Penjumlahan vektor gaya dua dimensi dan persamaan trigonometri sudut $R\\sin(\\beta - \\phi) = c$.',
      tahap6Penurunan: {
        langkah: [
          'Hitung tegangan tali dari $m_1$: $T = m_1(a\\cos\\alpha - g\\sin\\alpha)$',
          'Tentukan sudut $\\beta$ dari $10\\sin\\beta - 11\\cos\\beta = 2{,}8$:',
          'Tulis $R = \\sqrt{10^2 + 11^2} = \\sqrt{221}$ dan $\\tan\\phi = \\frac{11}{10} \\implies \\phi = 47{,}726^\\circ$',
          '$\\sin(\\beta - \\phi) = \\frac{2{,}8}{\\sqrt{221}} \\implies \\beta = \\phi + \\arcsin\\left(\\frac{2{,}8}{\\sqrt{221}}\\right)$',
          'Hitung resultan dua vektor sama besar $T$:',
          '$F_{\\text{katrol}} = T|\\hat{u}_1 + \\hat{u}_2| = T\\sqrt{2 - 2\\cos(\\beta - \\alpha)} = 2T\\sin\\left(\\frac{\\beta - \\alpha}{2}\\right)$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: 'F_{\\text{katrol}} = 2 T \\sin\\left(\\frac{\\beta - \\alpha}{2}\\right)',
          keterangan: [
            { simbol: 'T', arti: 'Tegangan tali sistem Soal 5', satuan: 'N', kondisi: 'T = m₁(a cos α − g sin α)' },
            { simbol: '\\beta - \\alpha', arti: 'Penyimpangan sudut belok tali di katrol', satuan: 'rad / °', kondisi: 'Lereng kiri naik α, kanan turun β' },
          ],
        },
      },
      tahap7Substitusi: [
        'Hitung $T$: $T = 5{,}0 \\times (11 \\times 0{,}8 - 10 \\times 0{,}6) = 5{,}0 \\times (8{,}8 - 6{,}0) = 14{,}0\\text{ N}$.',
        'Hitung $\\alpha = \\arcsin(0{,}6) = 36{,}8699^\\circ$.',
        'Hitung $\\beta$: $R = \\sqrt{221} \\approx 14{,}8661$, $\\phi = \\arctan(1{,}1) = 47{,}7263^\\circ$, $\\arcsin(2{,}8/14{,}8661) = 10{,}8514^\\circ$, maka $\\beta = 58{,}5777^\\circ$.',
        'Selisih sudut $\\beta - \\alpha = 58{,}5777^\\circ - 36{,}8699^\\circ = 21{,}7078^\\circ$, sehingga setengahnya adalah $10{,}8539^\\circ$.',
        '$F_{\\text{katrol}} = 2 \\times 14{,}0 \\times \\sin(10{,}8539^\\circ) = 28{,}0 \\times 0{,}188306 = 5{,}2726\\text{ N}$.',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '5,3',
        satuan: 'N',
        catatanPembulatan: 'Hasil internal 5,2726 N dibulatkan satu angka desimal menjadi 5,3.',
      },
      tahap9Interpretasi:
        'Meskipun setiap segmen tali menarik dengan gaya $14{,}0\\text{ N}$, poros katrol hanya merasakan resultan sebesar $5{,}3\\text{ N}$ karena kedua segmen nyaris sejajar membentuk sudut tumpul $158{,}3^\\circ$. Komponen horizontal dan vertikal gaya inilah yang menyumbang beban pada struktur penyangga katrol di atas kereta.',
      tahap10Kesimpulan:
        'Untuk soal vektor di katrol, selalu periksa sudut arah tiap segmen tali terhadap sumbu horizontal sebelum menggunakan aturan kosinus atau identitas setengah sudut.',
    },
    narrator: {
      soalDanStimulus:
        'Soal nomor dua belas menantang Anda menghitung resultan gaya tali pada poros katrol tepat pada kondisi Soal Nomor lima asli dengan percepatan satu koma satu g.',
      fbdDanKonsep:
        'Perhatikan arah kedua segmen tali dari katrol: segmen kiri menuju kiri-atas pada sudut alfa, sedangkan segmen kanan menuju kanan-bawah pada sudut beta. Karena sudut antara keduanya sangat tumpul, resultan gaya sama dengan dua T sinus setengah selisih beta dan alfa.',
      langkahPembahasan:
        'Tegangan tali bernilai empat belas Newton, sudut alfa tiga puluh enam koma delapan tujuh derajat, dan dari sepuluh sinus beta minus sebelas kosinus beta sama dengan dua koma delapan diperoleh beta lima puluh delapan koma lima delapan derajat. Hasil akhirnya lima koma dua tujuh Newton dibulatkan menjadi lima koma tiga Newton.',
      animasiDanInterpretasi:
        'Animasi menampilkan diagram vektor langsung di titik katrol: dua vektor oranye saling meniadakan sebagian besar komponennya, menyisakan vektor resultan biru kecil sebesar lima koma tiga Newton.',
    },
  },

  // =========================================================================
  // TIER 5: SOAL 13-15 (TANTANGAN OLIMPIADE TINGKAT KOTA KOMPLEKS)
  // =========================================================================
  {
    id: 13,
    tier: 5,
    tierLabel: 'Tantangan OSK',
    title: 'Teorema Usaha-Energi dalam Kerangka Kereta yang Dipercepat',
    subtopic: 'Energi Potensial Medan Gravitasi Efektif & Kelajuan Relatif',
    questionText:
      'Pada sistem kereta tanpa gesekan Soal Nomor 5 ($\\sin\\alpha = 3/5$, $\\sin\\beta = 4/5$), digunakan massa $m_1 = 3{,}0\\text{ kg}$ dan $m_2 = 1{,}0\\text{ kg}$. Kereta dipercepat konstan ke kanan sebesar $a = 1{,}2g$ ($g = 10\\text{ m/s}^2$). Awalnya kedua balok ditahan diam relatif terhadap kereta, lalu dilepaskan. Tentukan kelajuan relatif balok terhadap kereta ($v_{\\text{rel}}$, dalam $\\text{m/s}$) tepat setelah $m_1$ bergeser naik ke kiri-atas sejauh $d = 2{,}0\\text{ m}$ di sepanjang lereng!',
    unitLabel: 'm/s',
    answerExact: Math.sqrt(10),
    answerFormatted: '3,2',
    stimulus: {
      variant: 'double_wedge',
      alphaLabel: 'α (sin α = 3/5)',
      betaLabel: 'β (sin β = 4/5)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      m1Label: 'm₁ = 3,0 kg',
      m2Label: 'm₂ = 1,0 kg',
      accelDirection: 'right',
      accelLabel: 'a = 1,2g (geser d = 2,0 m)',
      hasPulley: true,
      frictionNote: 'Permukaan licin; dilepas dari diam hingga bergeser d = 2,0 m',
    },
    fbd: {
      frameDescription: 'Kerangka kereta (a = 12 m/s² ke kanan) — analisis usaha oleh gaya gravitasi dan gaya fiktif',
      axesDescription: 'Perpindahan m₁ sebesar d ke arah (−cos α, +sin α) dan perpindahan m₂ sebesar d ke arah (−cos β, +sin β)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      forcesM1: [
        { symbol: 'm₁g', label: 'Berat (30 N) → usaha negatif −m₁gd sin α', angleDeg: 270, color: '#DC2626', magnitudeScale: 1.0 },
        { symbol: 'm₁a', label: 'Gaya fiktif (36 N) → usaha positif +m₁ad cos α', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.2 },
        { symbol: 'N₁', label: 'Normal 1 (tegak lurus lintasan, W_N = 0)', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.5 },
        { symbol: 'T', label: 'Tegangan tali (usaha internal total = 0)', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.35 },
      ],
      forcesM2: [
        { symbol: 'm₂g', label: 'Berat (10 N) → usaha negatif −m₂gd sin β', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.6 },
        { symbol: 'm₂a', label: 'Gaya fiktif (12 N) → usaha positif +m₂ad cos β', angleDeg: 180, color: '#2563EB', magnitudeScale: 0.7 },
        { symbol: 'N₂', label: 'Normal 2 (W_N = 0)', angleDeg: 36.87, color: '#059669', magnitudeScale: 0.9 },
        { symbol: 'T', label: 'Tegangan tali (internal)', angleDeg: 126.87, color: '#D97706', magnitudeScale: 0.35 },
      ],
      extraNote: 'Dalam kerangka kereta, usaha gaya normal dan usaha total tegangan tali tepat bernilai nol!',
    },
    animation: {
      mode: 'relative_slip',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: 12.0,
      g: 10,
      m1: 3.0,
      m2: 1.0,
      aRel: 2.5,
      tensionN: 3.3,
      normal1N: 45.6,
      normal2N: 15.6,
      stageNotes: [
        'Pada kerangka kereta, kedua balok bergeser sejauh d = 2,0 m ke kiri (m₁ menjauhi katrol, m₂ mendekati katrol).',
        'Usaha gaya fiktif (+72,0 J) mengalahkan usaha negatif gravitasi (−52,0 J), menghasilkan usaha bersih +20,0 J.',
        'Energi kinetik relatif menjadi 20,0 J sehingga v_rel = √10 ≈ 3,2 m/s.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Dalam kerangka kereta yang dipercepat konstan ke kanan, medan gaya fiktif $\\vec{F}_{\\text{fiktif}} = -m\\vec{a}$ bertindak persis seperti medan gravitasi horizontal konstan. Karena itu kita dapat menerapkan Teorema Usaha-Energi langsung di dalam kerangka kereta untuk mencari kelajuan relatif tanpa perlu menghitung waktu tempuh terlebih dahulu.',
      tahap2Informasi: {
        diketahui: [
          '$m_1 = 3{,}0\\text{ kg}$, $m_2 = 1{,}0\\text{ kg}$',
          '$\\sin\\alpha = 0{,}6$, $\\cos\\alpha = 0{,}8$',
          '$\\sin\\beta = 0{,}8$, $\\cos\\beta = 0{,}6$',
          '$a = 1{,}2g = 12\\text{ m/s}^2$, $g = 10\\text{ m/s}^2$, $d = 2{,}0\\text{ m}$',
        ],
        ditanyakan: 'Kelajuan relatif $v_{\\text{rel}}$ saat $d = 2{,}0\\text{ m}$',
        besaranDicari: 'Kelajuan relatif balok terhadap kereta dalam $\\text{m/s}$',
        informasiTambahan: 'Sistem berawal dari diam relatif ($v_{\\text{rel},0} = 0$).',
      },
      tahap3Model:
        'Ketika $m_1$ naik sejauh $d$ ke kiri-atas, kedua benda sama-sama naik secara vertikal ($\\Delta y_1 = d\\sin\\alpha$, $\\Delta y_2 = d\\sin\\beta$) dan sama-sama bergeser ke kiri ($\\Delta x_1 = -d\\cos\\alpha$, $\\Delta x_2 = -d\\cos\\beta$). Gaya normal selalu tegak lurus lintasan relatif sehingga usahanya nol; tegangan tali bekerja berlawanan arah perpindahan masing-masing sama besar sehingga usaha totalnya nol.',
      tahap4VisualFbd:
        'Usaha total di kerangka non-inersia hanya berasal dari gravitasi ($W_g < 0$ karena kedua benda naik) dan gaya fiktif ke kiri ($W_f > 0$ karena kedua benda bergeser ke kiri).',
      tahap5Prinsip:
        'Teorema Usaha-Energi dalam kerangka acuan non-inersia: $W_{\\text{grav}} + W_{\\text{fiktif}} = \\Delta K_{\\text{rel}}$.',
      tahap6Penurunan: {
        langkah: [
          'Usaha gaya gravitasi: $W_{\\text{grav}} = -(m_1\\sin\\alpha + m_2\\sin\\beta) g d$',
          'Usaha gaya fiktif: $W_{\\text{fiktif}} = +(m_1\\cos\\alpha + m_2\\cos\\beta) a d$',
          'Energi kinetik relatif akhir: $\\Delta K_{\\text{rel}} = \\frac{1}{2}(m_1 + m_2) v_{\\text{rel}}^2$',
          'Samakan usaha bersih dengan perubahan energi kinetik relatif:',
          '$\\frac{1}{2}(m_1 + m_2) v_{\\text{rel}}^2 = \\left[a(m_1\\cos\\alpha + m_2\\cos\\beta) - g(m_1\\sin\\alpha + m_2\\sin\\beta)\\right] d$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: 'v_{\\text{rel}} = \\sqrt{\\frac{2 d \\left[a(m_1\\cos\\alpha + m_2\\cos\\beta) - g(m_1\\sin\\alpha + m_2\\sin\\beta)\\right]}{m_1 + m_2}}',
          keterangan: [
            { simbol: 'v_{\\text{rel}}', arti: 'Kelajuan relatif masing-masing balok terhadap kereta', satuan: 'm/s', kondisi: 'Berawal dari diam relatif, T > 0' },
            { simbol: 'd', arti: 'Jarak pergeseran sepanjang lereng', satuan: 'm', kondisi: 'Percepatan kereta konstan' },
          ],
        },
      },
      tahap7Substitusi: [
        '$W_{\\text{fiktif}} = 12 \\times (3{,}0\\times 0{,}8 + 1{,}0\\times 0{,}6) \\times 2{,}0 = 12 \\times 3{,}0 \\times 2{,}0 = +72{,}0\\text{ J}$.',
        '$W_{\\text{grav}} = -10 \\times (3{,}0\\times 0{,}6 + 1{,}0\\times 0{,}8) \\times 2{,}0 = -10 \\times 2{,}6 \\times 2{,}0 = -52{,}0\\text{ J}$.',
        'Usaha bersih $W_{\\text{total}} = 72{,}0 - 52{,}0 = 20{,}0\\text{ J}$.',
        '$\\frac{1}{2}(3{,}0 + 1{,}0) v_{\\text{rel}}^2 = 20{,}0 \\implies 2{,}0 v_{\\text{rel}}^2 = 20{,}0 \\implies v_{\\text{rel}} = \\sqrt{10} \\approx 3{,}1623\\text{ m/s}$.',
        'Cek validitas tali tegang: $a_{\\text{rel}} = 2{,}5\\text{ m/s}^2 \\implies T = 3{,}0(12\\times 0{,}8 - 6{,}0 - 2{,}5) = 3{,}3\\text{ N} > 0$.',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '3,2',
        satuan: 'm/s',
        catatanPembulatan: 'Hasil internal √10 ≈ 3,1623 dibulatkan satu angka desimal menjadi 3,2.',
      },
      tahap9Interpretasi:
        'Menggunakan metode usaha-energi di kerangka tanah langsung akan jauh lebih rumit karena gaya normal melakukan usaha positif besar akibat gerak kereta ke kanan! Dengan memilih kerangka kereta, usaha gaya normal lenyap menjadi nol dan soal selesai dalam dua baris energi.',
      tahap10Kesimpulan:
        'Gaya fiktif akibat percepatan translasi seragam bersifat konservatif sehingga sah diperlakukan sebagai sumber energi potensial semu di kerangka non-inersia.',
    },
    narrator: {
      soalDanStimulus:
        'Memasuki tantangan Olimpiade tingkat kota soal nomor tiga belas, kita menghubungkan sistem Soal lima dengan teorema usaha dan energi di dalam kerangka kereta.',
      fbdDanKonsep:
        'Keindahan metode kerangka non-inersia terlihat jelas di sini: gaya normal selalu tegak lurus lintasan relatif sehingga usahanya nol, sementara gaya fiktif konstan bekerja seperti gravitasi horizontal yang konservatif.',
      langkahPembahasan:
        'Usaha gaya fiktif sebesar tujuh puluh dua Joule dikurangi usaha gravitasi lima puluh dua Joule menyisakan dua puluh Joule energi kinetik relatif. Untuk massa total empat kilogram, kelajuan relatif sama dengan akar sepuluh yaitu tiga koma dua meter per sekon.',
      animasiDanInterpretasi:
        'Amati grafik energi pada simulasi: energi kinetik relatif meningkat linear terhadap jarak pergeseran d akibat selisih usaha fiktif dan gravitasi.',
    },
  },
  {
    id: 14,
    tier: 5,
    tierLabel: 'Tantangan OSK',
    title: 'Transformasi Kecepatan Absolut Balok terhadap Kerangka Tanah',
    subtopic: 'Kinematika Relatif Vektor 2D dari Dinamika Kerangka Non-Inersia',
    questionText:
      'Pada sistem kereta tanpa gesekan Soal Nomor 5 ($\\sin\\alpha = 3/5$, $\\sin\\beta = 4/5$, $m_1 = m_2 = 2{,}0\\text{ kg}$), pada saat $t = 0$ kereta mulai dipercepat dari keadaan diam ke kanan dengan percepatan konstan $a = 2{,}0g$ ($g = 10\\text{ m/s}^2$), dan pada saat yang sama kedua balok dilepaskan dari keadaan diam relatif terhadap kereta. Tentukan besar kecepatan (kelajuan) balok $m_1$ **relatif terhadap lantai/tanah (kerangka inersia)** tepat pada saat $t = 0{,}5\\text{ s}$ (dalam $\\text{m/s}$)!',
    unitLabel: 'm/s',
    answerExact: 7.5,
    answerFormatted: '7,5',
    stimulus: {
      variant: 'double_wedge',
      alphaLabel: 'α (sin α = 3/5)',
      betaLabel: 'β (sin β = 4/5)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      m1Label: 'm₁ = 2,0 kg',
      m2Label: 'm₂ = 2,0 kg',
      accelDirection: 'right',
      accelLabel: 'a = 2,0g (v_tanah pada t = 0,5 s)',
      hasPulley: true,
      frictionNote: 'Kereta & balok berawal dari diam pada t = 0',
      showVelocityFrame: true,
    },
    fbd: {
      frameDescription: 'Kombinasi dinamika kerangka kereta (a_rel) + penjumlahan vektor kecepatan v_tanah = v_kereta + v_rel',
      axesDescription: 'v_kereta sepanjang +x (kanan); v_rel pada m₁ sepanjang (−cos α, +sin α)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      forcesM1: [
        { symbol: 'm₁g', label: 'Berat (20 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.8 },
        { symbol: 'N₁', label: 'Normal 1 (40 N)', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.5 },
        { symbol: 'm₁a', label: 'Gaya fiktif (40 N)', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.5 },
        { symbol: 'T', label: 'Tegangan tali (6,0 N)', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.4 },
      ],
      forcesM2: [
        { symbol: 'm₂g', label: 'Berat (20 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.8 },
        { symbol: 'N₂', label: 'Normal 2 (44 N)', angleDeg: 36.87, color: '#059669', magnitudeScale: 1.6 },
        { symbol: 'm₂a', label: 'Gaya fiktif (40 N)', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.5 },
        { symbol: 'T', label: 'Tegangan tali (6,0 N)', angleDeg: 126.87, color: '#D97706', magnitudeScale: 0.4 },
      ],
      extraNote: 'Hati-hati! Walaupun m₁ bergerak ke KIRI relatif terhadap kereta, ke tanah ia tetap bergerak ke KANAN-ATAS karena laju kereta lebih besar.',
    },
    animation: {
      mode: 'lab_velocity',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: 20.0,
      g: 10,
      m1: 2.0,
      m2: 2.0,
      aRel: 7.0,
      tensionN: 6.0,
      normal1N: 40.0,
      normal2N: 44.0,
      stageNotes: [
        'Pada t = 0,5 s, kereta telah mencapai laju ke kanan v_K = 10,0 m/s.',
        'Pada saat yang sama, m₁ meluncur relatif ke kiri-atas dengan laju v_rel = 3,5 m/s.',
        'Penjumlahan vektor memberi kecepatan absolut v₁ = (7,2 i + 2,1 j) m/s dengan besar tepat 7,5 m/s.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Soal ini menyatukan dinamika non-inersia dan transformasi kinematika Galilean. Pertama kita tentukan percepatan relatif $m_1$ terhadap kereta, lalu mengubah vektor kecepatan relatif tersebut kembali ke kerangka inersia tanah dengan menambahkan vektor kecepatan kereta saat $t = 0{,}5\\text{ s}$.',
      tahap2Informasi: {
        diketahui: [
          '$m_1 = m_2 = 2{,}0\\text{ kg}$',
          '$\\sin\\alpha = 0{,}6$, $\\cos\\alpha = 0{,}8$; $\\sin\\beta = 0{,}8$, $\\cos\\beta = 0{,}6$',
          '$a = 2{,}0g = 20\\text{ m/s}^2$, $g = 10\\text{ m/s}^2$',
          'Keadaan awal diam pada $t = 0$; ditinjau saat $t = 0{,}5\\text{ s}$',
        ],
        ditanyakan: 'Kelajuan absolut balok $m_1$ terhadap tanah $|\\vec{v}_1|$',
        besaranDicari: 'Magnitudo vektor kecepatan terhadap tanah dalam $\\text{m/s}$',
        informasiTambahan: 'Arah gerak relatif $m_1$ adalah ke kiri-atas sepanjang lereng $\\alpha$.',
      },
      tahap3Model:
        'Langkah pertama memakai kerangka kereta untuk mencari percepatan relatif konstan $a_{\\text{rel}}$. Langkah kedua memakai kinematika GLBB dan penjumlahan vektor $\\vec{v}_1 = \\vec{v}_{\\text{kereta}} + \\vec{v}_{1,\\text{rel}}$.',
      tahap4VisualFbd:
        'Dalam kerangka kereta, $a = 20\\text{ m/s}^2$ mendorong sistem kuat ke kiri-atas. Vektor kecepatan relatif $\\vec{v}_{1,\\text{rel}}$ memiliki komponen horizontal negatif ($-v_{\\text{rel}}\\cos\\alpha$) dan komponen vertikal positif ($+v_{\\text{rel}}\\sin\\alpha$).',
      tahap5Prinsip:
        'Hukum II Newton pada kerangka non-inersia dan Transformasi Kecepatan Relatif Galilean.',
      tahap6Penurunan: {
        langkah: [
          'Hitung $a_{\\text{rel}}$ (seperti Soal 8):',
          '$a_{\\text{rel}} = \\frac{m_1(a\\cos\\alpha - g\\sin\\alpha) + m_2(a\\cos\\beta - g\\sin\\beta)}{m_1 + m_2}$',
          'Pada saat $t$: $v_{\\text{kereta}} = a t$ dan $v_{\\text{rel}} = a_{\\text{rel}} t$.',
          'Komponen kecepatan $m_1$ terhadap tanah:',
          '$v_{1x} = a t - v_{\\text{rel}}\\cos\\alpha$, dan $v_{1y} = v_{\\text{rel}}\\sin\\alpha$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: '|\\vec{v}_1| = \\sqrt{(a t - a_{\\text{rel}} t\\cos\\alpha)^2 + (a_{\\text{rel}} t\\sin\\alpha)^2}',
          keterangan: [
            { simbol: 'v_{1x}, v_{1y}', arti: 'Komponen kecepatan balok m₁ terhadap tanah', satuan: 'm/s', kondisi: 'Kereta & balok mula-mula diam' },
            { simbol: 't', arti: 'Selang waktu pengamatan sejak dilepas', satuan: 's', kondisi: 'Sebelum balok mencapai ujung lereng' },
          ],
        },
      },
      tahap7Substitusi: [
        'Hitung $a_{\\text{rel}}$: $a_{\\text{rel}} = \\frac{2(20\\times 0{,}8 - 6) + 2(20\\times 0{,}6 - 8)}{4} = \\frac{20 + 8}{4} = 7{,}0\\text{ m/s}^2$.',
        'Cek tegangan tali: $T = 2(10 - 7{,}0) = 6{,}0\\text{ N} > 0$ (tali tegang!).',
        'Pada $t = 0{,}5\\text{ s}$: laju kereta $v_K = 20 \\times 0{,}5 = 10{,}0\\text{ m/s}$; laju relatif $v_{\\text{rel}} = 7{,}0 \\times 0{,}5 = 3{,}5\\text{ m/s}$.',
        '$v_{1x} = 10{,}0 - 3{,}5(0{,}8) = 10{,}0 - 2{,}8 = 7{,}2\\text{ m/s}$.',
        '$v_{1y} = 3{,}5(0{,}6) = 2{,}1\\text{ m/s}$.',
        '$|\\vec{v}_1| = \\sqrt{7{,}2^2 + 2{,}1^2} = \\sqrt{51{,}84 + 4{,}41} = \\sqrt{56{,}25} = 7{,}5\\text{ m/s}$ (tripel Pythagoras $7$-$24$-$25$!).',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '7,5',
        satuan: 'm/s',
        catatanPembulatan: 'Hasil eksak akar kuadrat adalah 7,5.',
      },
      tahap9Interpretasi:
        'Walaupun pengamat di dalam kereta melihat $m_1$ meluncur ke kiri-atas, pengamat di lantai melihat $m_1$ tetap bergerak maju ke kanan-atas dengan komponen horizontal $7{,}2\\text{ m/s}$ karena laju kereta ke kanan ($10{,}0\\text{ m/s}$) jauh melampaui komponen mundur relatifnya ($2{,}8\\text{ m/s}$).',
      tahap10Kesimpulan:
        'Selalu konversi besaran kembali ke kerangka inersia melalui penjumlahan vektor apabila soal menanyakan kecepatan atau energi kinetik absolut terhadap tanah.',
    },
    narrator: {
      soalDanStimulus:
        'Soal nomor empat belas menguji kemampuan menggabungkan dinamika non-inersia dengan transformasi vektor kecepatan ke kerangka tanah.',
      fbdDanKonsep:
        'Pertama tentukan percepatan relatif di atas kereta, lalu ubah ke kerangka tanah dengan menjumlahkan vektor kecepatan kereta dan vektor kecepatan relatif.',
      langkahPembahasan:
        'Percepatan relatif bernilai tujuh meter per sekon kuadrat. Pada nol koma lima sekon, kecepatan kereta sepuluh meter per sekon ke kanan dan kecepatan relatif tiga koma lima meter per sekon ke kiri-atas. Komponen ke tanah menjadi tujuh koma dua dan dua koma satu, menghasilkan kelajuan absolut tepat tujuh koma lima meter per sekon.',
      animasiDanInterpretasi:
        'Aktifkan mode kerangka tanah pada animasi untuk melihat lintasan diagonal balok m satu yang tetap bergerak maju ke kanan-atas sambil mendaki lereng kereta.',
    },
  },
  {
    id: 15,
    tier: 5,
    tierLabel: 'Tantangan OSK',
    title: 'Rentang Gaya Dorong Kritis dengan Gesekan Statis pada Kedua Lereng',
    subtopic: 'Pembalikan Arah Gesekan Dua Arah & Dinamika Total Sistem Soal 5',
    questionText:
      'Sebagai tantangan puncak pengembangan Soal Nomor 5: sebuah kereta bermassa $M = 11{,}0\\text{ kg}$ di atas lantai datar licin membawa balok $m_1 = 2{,}0\\text{ kg}$ ($\\sin\\alpha = 3/5$) dan $m_2 = 2{,}0\\text{ kg}$ ($\\sin\\beta = 4/5$). Kini **kedua** permukaan lereng memiliki koefisien gesekan statis yang sama $\\mu_s = 0{,}25$ (gunakan $g = 10\\text{ m/s}^2$). Kereta didorong ke kanan oleh gaya horizontal konstan $F$. Tentukan selisih antara gaya dorong maksimum dan minimum, $\\Delta F = F_{\\text{maks}} - F_{\\text{min}}$ (dalam Newton), yang masih membuat kedua balok tetap diam relatif terhadap kereta!',
    unitLabel: 'N',
    answerExact: 160.0,
    answerFormatted: '160,0',
    stimulus: {
      variant: 'rough_both',
      alphaLabel: 'α (sin α = 3/5, μ_s = 0,25)',
      betaLabel: 'β (sin β = 4/5, μ_s = 0,25)',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      m1Label: 'm₁ = 2,0 kg',
      m2Label: 'm₂ = 2,0 kg',
      cartLabel: 'M = 11,0 kg',
      accelDirection: 'right',
      accelLabel: 'F_min ≤ F ≤ F_maks',
      forceLabel: 'F',
      hasPulley: true,
      frictionNote: 'Kedua lereng kasar (μ_s = 0,25); lantai licin',
    },
    fbd: {
      frameDescription: 'Dua kondisi ekstrem kritis: (A) Ambang F_maks (keduanya hampir meluncur ke kiri-atas); (B) Ambang F_min (keduanya hampir meluncur ke kanan-bawah)',
      axesDescription: 'Arah gaya gesek f₁ dan f₂ membalik serentak antara kondisi F_maks dan F_min',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      forcesM1: [
        { symbol: 'm₁g', label: 'Berat m₁ (20 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
        { symbol: 'N₁', label: 'Normal m₁', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.3 },
        { symbol: 'm₁a', label: 'Gaya fiktif ke kiri', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.2 },
        { symbol: 'T', label: 'Tegangan tali (T > 0 di kedua batas)', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.45 },
        { symbol: '±f₁', label: 'Gesekan statis (ke katrol saat F_maks, menjauhi saat F_min)', angleDeg: 323.13, color: '#7C3AED', magnitudeScale: 0.5 },
      ],
      forcesM2: [
        { symbol: 'm₂g', label: 'Berat m₂ (20 N)', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
        { symbol: 'N₂', label: 'Normal m₂', angleDeg: 36.87, color: '#059669', magnitudeScale: 1.3 },
        { symbol: 'm₂a', label: 'Gaya fiktif ke kiri', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.2 },
        { symbol: 'T', label: 'Tegangan tali', angleDeg: 126.87, color: '#D97706', magnitudeScale: 0.45 },
        { symbol: '±f₂', label: 'Gesekan statis (menjauhi katrol saat F_maks, menuju saat F_min)', angleDeg: 306.87, color: '#7C3AED', magnitudeScale: 0.5 },
      ],
      extraNote: 'Kunci ketelitian: saat m₂ hampir meluncur NAIK menuju katrol (F_maks), f₂ berarah TURUN menjauhi katrol (searah gravitasi m₂g sin β)!',
    },
    animation: {
      mode: 'friction_bounds',
      alphaDeg: 36.87,
      betaDeg: 53.13,
      aCart: 16.67,
      g: 10,
      m1: 2.0,
      m2: 2.0,
      M: 11.0,
      muS: 0.25,
      aRel: 0,
      tensionN: 5.67,
      normal1N: 36.0,
      normal2N: 38.67,
      stageNotes: [
        'Pada batas bawah F_min = 90,0 N (a_min = 6,0 m/s²), kedua balok nyaris meluncur turun ke kanan-bawah; kedua gesekan menahan ke kiri-atas.',
        'Pada batas atas F_maks = 250,0 N (a_maks = 50/3 m/s²), kedua balok nyaris meluncur naik ke kiri-atas; kedua gesekan menahan ke kanan-bawah.',
        'Selisih rentang gaya dorong aman adalah ΔF = 250,0 − 90,0 = 160,0 N dengan tali tetap tegang di kedua batas.',
      ],
    },
    solution: {
      tahap1Fenomena:
        'Ketika kedua lereng memiliki gesekan statis, rentang kestabilan percepatan kereta semakin lebar. Ada dua titik kritis: pada gaya dorong maksimum $F_{\\text{maks}}$, dorongan fiktif ke kiri sangat kuat sehingga kedua balok nyaris meluncur serentak ke **kiri-atas**; sebaliknya pada gaya dorong minimum $F_{\\text{min}}$, gravitasi lebih dominan sehingga keduanya nyaris meluncur serentak ke **kanan-bawah**.',
      tahap2Informasi: {
        diketahui: [
          '$M = 11{,}0\\text{ kg}$, $m_1 = m_2 = m = 2{,}0\\text{ kg}$ ($M_{\\text{total}} = 15{,}0\\text{ kg}$)',
          '$\\sin\\alpha = 0{,}6$, $\\cos\\alpha = 0{,}8$; $\\sin\\beta = 0{,}8$, $\\cos\\beta = 0{,}6$',
          '$\\mu_s = 0{,}25$ pada kedua lereng; $g = 10\\text{ m/s}^2$',
        ],
        ditanyakan: 'Selisih gaya dorong maksimum dan minimum $\\Delta F = F_{\\text{maks}} - F_{\\text{min}}$',
        besaranDicari: 'Lebar rentang gaya dalam Newton (N)',
        informasiTambahan: 'Wajib memeriksa bahwa $T > 0$ pada $a_{\\text{maks}}$ maupun $a_{\\text{min}}$.',
      },
      tahap3Model:
        'Untuk setiap percepatan stabil $a$, berlaku $F = (M + m_1 + m_2)a$. Kita cari terlebih dahulu $a_{\\text{maks}}$ (saat $f_1, f_2$ berarah ke kanan-bawah) dan $a_{\\text{min}}$ (saat $f_1, f_2$ berarah ke kiri-atas), lalu memverifikasi $T > 0$ di kedua ujung batas.',
      tahap4VisualFbd:
        'Amati arah kedua gaya gesek terhadap tali: pada $a_{\\text{maks}}$ ($m_1$ naik menjauhi katrol, $m_2$ naik mendekati katrol), gesekan pada $m_1$ mengarah ke kanan-bawah (membantu $T$) dan gesekan pada $m_2$ mengarah ke kanan-bawah (melawan $T$, searah gravitasi!). Pada $a_{\\text{min}}$, keduanya berbalik arah.',
      tahap5Prinsip:
        'Kesetimbangan kritis dua arah pada kerangka non-inersia dan Hukum II Newton sistem total.',
      tahap6Penurunan: {
        langkah: [
          'Kasus 1 ($a = a_{\\text{maks}}$, hampir meluncur ke kiri-atas):',
          'Pada $m_1$: $T = m[a\\cos\\alpha - g\\sin\\alpha - \\mu_s(g\\cos\\alpha + a\\sin\\alpha)]$',
          'Pada $m_2$: $T = m[g\\sin\\beta - a\\cos\\beta + \\mu_s(g\\cos\\beta + a\\sin\\beta)]$',
          'Samakan $T \\implies a_{\\text{maks}} = g \\frac{(\\sin\\beta + \\mu_s\\cos\\beta) + (\\sin\\alpha + \\mu_s\\cos\\alpha)}{(\\cos\\alpha - \\mu_s\\sin\\alpha) + (\\cos\\beta - \\mu_s\\sin\\beta)}$',
          'Kasus 2 ($a = a_{\\text{min}}$, hampir meluncur ke kanan-bawah): tanda $\\mu_s$ pada keempat suku berbalik:',
          '$a_{\\text{min}} = g \\frac{(\\sin\\beta - \\mu_s\\cos\\beta) + (\\sin\\alpha - \\mu_s\\cos\\alpha)}{(\\cos\\alpha + \\mu_s\\sin\\alpha) + (\\cos\\beta + \\mu_s\\sin\\beta)}$',
        ],
        rumusUtama: {
          judul: 'RUMUS UTAMA',
          latex: '\\Delta F = (M + m_1 + m_2)(a_{\\text{maks}} - a_{\\text{min}})',
          keterangan: [
            { simbol: 'a_{\\text{maks}}, a_{\\text{min}}', arti: 'Batas atas dan bawah percepatan tanpa selip', satuan: 'm/s²', kondisi: 'T ≥ 0 dan kontak terjaga' },
            { simbol: 'M + m_1 + m_2', arti: 'Massa total sistem komposit', satuan: 'kg', kondisi: 'Lantai licin' },
          ],
        },
      },
      tahap7Substitusi: [
        'Hitung $a_{\\text{maks}}$: pembilang $= (0{,}8 + 0{,}15) + (0{,}6 + 0{,}20) = 0{,}95 + 0{,}80 = 1{,}75$. Penyebut $= (0{,}8 - 0{,}15) + (0{,}6 - 0{,}20) = 0{,}65 + 0{,}40 = 1{,}05$.',
        '$a_{\\text{maks}} = \\frac{1{,}75}{1{,}05} g = \\frac{5}{3} g = \\frac{50}{3}\\text{ m/s}^2$. (Cek $T = 2[0{,}95(10) - 0{,}40(50/3)] = 5{,}67\\text{ N} > 0$).',
        'Hitung $a_{\\text{min}}$: pembilang $= (0{,}8 - 0{,}15) + (0{,}6 - 0{,}20) = 0{,}65 + 0{,}40 = 1{,}05$. Penyebut $= (0{,}8 + 0{,}15) + (0{,}6 + 0{,}20) = 0{,}95 + 0{,}80 = 1{,}75$.',
        '$a_{\\text{min}} = \\frac{1{,}05}{1{,}75} g = \\frac{3}{5} g = 6{,}0\\text{ m/s}^2$. (Cek $T = 2[0{,}95(6) - 0{,}40(10)] = 3{,}40\\text{ N} > 0$).',
        'Hitung $F_{\\text{maks}} = 15{,}0 \\times \\frac{50}{3} = 250{,}0\\text{ N}$ dan $F_{\\text{min}} = 15{,}0 \\times 6{,}0 = 90{,}0\\text{ N}$.',
        '$\\Delta F = 250{,}0 - 90{,}0 = 160{,}0\\text{ N}$.',
      ],
      tahap8HasilAkhir: {
        nilaiFormatKoma: '160,0',
        satuan: 'N',
        catatanPembulatan: 'Hasil eksak satu angka desimal adalah 160,0.',
      },
      tahap9Interpretasi:
        'Perhatikan simetri yang menakjubkan: karena $m_1 = m_2$, faktor pembilang pada $a_{\\text{maks}}$ ($1{,}75$) menjadi penyebut pada $a_{\\text{min}}$, dan sebaliknya ($1{,}05$), sehingga $a_{\\text{maks}} \\cdot a_{\\text{min}} = g^2$ atau $a_{\\text{maks}} = \\frac{5}{3}g$ dan $a_{\\text{min}} = \\frac{3}{5}g$! Gaya dorong antara $90{,}0\\text{ N}$ hingga $250{,}0\\text{ N}$ menjaga seluruh sistem tetap kokoh diam relatif.',
      tahap10Kesimpulan:
        'Menentukan arah gaya gesek berdasarkan kecenderungan gerak relatif masing-masing massa dan selalu memverifikasi ketegangan tali ($T > 0$) merupakan kunci menyelesaikan persoalan mekanika Olimpiade tingkat kota paling kompleks.',
    },
    narrator: {
      soalDanStimulus:
        'Inilah soal puncak nomor lima belas yang menggabungkan seluruh konsep dari Soal satu hingga empat belas: kedua lereng kini memiliki gesekan statis nol koma dua lima!',
      fbdDanKonsep:
        'Kita harus mencari dua batas ekstrem. Pada batas gaya maksimum, kedua balok nyaris meluncur naik ke kiri-atas sehingga kedua gaya gesek berarah ke kanan-bawah. Pada batas gaya minimum, arah kedua gaya gesek berbalik sempurna ke kiri-atas.',
      langkahPembahasan:
        'Dari persamaan tali diperoleh percepatan maksimum lima per tiga g dan percepatan minimum tiga per lima g. Dikalikan massa total lima belas kilogram, F maksimum dua ratus lima puluh Newton dan F minimum sembilan puluh Newton, sehingga selisihnya tepat seratus enam puluh koma nol Newton.',
      animasiDanInterpretasi:
        'Saksikan pada animasi bagaimana sistem mampu bertahan diam sepanjang rentang gaya dorong yang lebar, dan nilai tegangan tali tetap positif di kedua kondisi batas. Selamat, Anda telah menuntaskan seluruh lima belas soal pengembangan Soal Nomor lima!',
    },
  },
];
