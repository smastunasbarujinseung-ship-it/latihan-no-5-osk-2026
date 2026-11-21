export interface ConceptNode {
  id: string;
  title: string;
  category: 'prasyarat' | 'inti' | 'pengembangan';
  summary: string;
  equations: string[];
  connectsTo: string[];
}

export interface TheorySection {
  number: number;
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  formulaCard?: {
    label: string;
    latex: string;
    variables: Array<{ symbol: string; meaning: string; unit: string }>;
    condition: string;
  };
  visualType:
    | 'source_system'
    | 'frame_comparison'
    | 'pseudo_force_vector'
    | 'fbd_m1_m2'
    | 'pulley_constraint'
    | 'normal_graph'
    | 'tension_vs_accel'
    | 'stability_bounds'
    | 'recoil_momentum'
    | 'energy_work';
  visualCaption: string;
  narratorScript: string;
}

export const SOURCE_PROBLEM_5 = {
  title: 'Soal Asli Nomor 5 — OSK Fisika SMA 2026',
  topic: 'Hukum Newton: Dinamika Sistem Terkopel pada Kerangka Dipercepat',
  statement:
    'Pada sistem tanpa gesekan di bawah ini, nilai $\\sin \\alpha = 3/5$. Ketika pada kereta diberikan percepatan ke arah kanan sebesar $1{,}1g$ ternyata $m_1$ maupun $m_2$ tidak bergerak relatif terhadap kereta. Anggap katrol dan tali tidak bermassa. Jika $m_1/m_2 = 1$, nilai $10 \\sin \\beta - 11 \\cos \\beta$ sama dengan ...',
  officialAnswer: '2,8',
  analysisChecklist: {
    topikUtama: 'Dinamika Partikel & Hukum Newton',
    subtopik: 'Kesetimbangan Relatif pada Kerangka Acuan Non-Inersia, Sistem Katrol-Bidang Miring Ganda',
    konsepHukum: [
      'Hukum I & II Newton dalam kerangka inersia dan non-inersia',
      'Gaya fiktif (gaya inersia) $\\vec{F}_{\\text{fiktif}} = -m\\vec{a}_{\\text{kerangka}}$',
      'Kendala tali tak mulur dan katrol licin tak bermassa ($T_1 = T_2 = T$)',
      'Dekomposisi vektor gaya pada koordinat miring ortogonal ($\\hat{u}, \\hat{n}$)',
    ],
    prasyarat: [
      'Trigonometri dasar dan identitas segitiga siku-siku ($3$-$4$-$5$)',
      'Diagram Benda Bebas (Free Body Diagram) pada bidang miring tunggal',
      'Hukum II Newton pada sistem katrol sederhana (Atwood miring)',
      'Konsep kecepatan dan percepatan relatif antar kerangka acuan',
    ],
    polaPenalaran: [
      'Identifikasi kondisi diam relatif terhadap kereta ($\\vec{a}_{\\text{rel}} = 0$).',
      'Pilih kerangka acuan kereta (non-inersia) sehingga setiap massa menerima gaya fiktif ke kiri $m_i a$.',
      'Proyeksikan gaya berat, gaya fiktif, gaya normal, dan tegangan tali sejajar lereng masing-masing.',
      'Eliminasi tegangan tali $T$ antara persamaan $m_1$ dan $m_2$ memanfaatkan $m_1 = m_2$.',
      'Susun ulang suku $\\sin \\beta$ dan $\\cos \\beta$ sehingga membentuk tepat $10\\sin \\beta - 11\\cos \\beta$.',
    ],
  },
};

export const CONCEPT_NODES: ConceptNode[] = [
  {
    id: 'trigonometri',
    title: 'Geometri & Proyeksi Vektor Lereng',
    category: 'prasyarat',
    summary:
      'Menguraikan vektor vertikal (berat $mg$) dan vektor horizontal (gaya fiktif $ma$ atau percepatan kereta) ke sumbu sejajar dan tegak lurus bidang miring bersudut $\\alpha$ dan $\\beta$.',
    equations: ['F_{\\parallel} = F_x \\cos\\theta \\pm F_y \\sin\\theta', '\\sin^2\\alpha + \\cos^2\\alpha = 1'],
    connectsTo: ['fbd-miring', 'kerangka-non-inersia'],
  },
  {
    id: 'fbd-miring',
    title: 'Diagram Benda Bebas (FBD) Bidang Miring',
    category: 'prasyarat',
    summary:
      'Menggambar seluruh gaya nyata yang bekerja pada tiap massa secara terpisah: gaya gravitasi $mg$, gaya normal tegak lurus bidang $N$, dan tegangan tali $T$ sepanjang tali.',
    equations: ['\\sum \\vec{F}_{\\text{nyata}} = m \\vec{a}_{\\text{tanah}}'],
    connectsTo: ['kendala-katrol', 'syarat-kontak'],
  },
  {
    id: 'kerangka-non-inersia',
    title: 'Kerangka Acuan Non-Inersia & Gaya Fiktif',
    category: 'inti',
    summary:
      'Saat mengamati benda dari dalam kereta yang dipercepat dengan $\\vec{a}$, Hukum II Newton tetap berlaku asalkan ditambahkan gaya fiktif $\\vec{F}_{\\text{fiktif}} = -m\\vec{a}$ yang berarah berlawanan dengan percepatan kereta.',
    equations: ['\\sum \\vec{F}_{\\text{nyata}} - m\\vec{a} = m\\vec{a}_{\\text{rel}}'],
    connectsTo: ['kesetimbangan-relatif', 'usaha-energi-fiktif'],
  },
  {
    id: 'kendala-katrol',
    title: 'Kendala Tali & Katrol Tak Bermassa',
    category: 'inti',
    summary:
      'Karena tali tak bermassa, tak mulur, dan katrol licin tak bermassa, besar tegangan tali $T$ di lereng kiri dan kanan sama besar, serta perpindahan relatif keduanya berkendala $\\Delta s_1 + \\Delta s_2 = 0$.',
    equations: ['T_1 = T_2 = T > 0', '\\ddot{s}_1 = -\\ddot{s}_2 = a_{\\text{rel}}'],
    connectsTo: ['kesetimbangan-relatif', 'resultan-katrol'],
  },
  {
    id: 'kesetimbangan-relatif',
    title: 'Kesetimbangan Relatif Soal Nomor 5',
    category: 'inti',
    summary:
      'Ketika $a_{\\text{rel}} = 0$, gaya dorong fiktif pada $m_1$ mengalahkan komponen beratnya sehingga menarik tali ($T = m_1(a\\cos\\alpha - g\\sin\\alpha)$), tepat mengimbangi tarikan $m_2$ ($T = m_2(g\\sin\\beta - a\\cos\\beta)$).',
    equations: ['m_1(a\\cos\\alpha - g\\sin\\alpha) = m_2(g\\sin\\beta - a\\cos\\beta)'],
    connectsTo: ['syarat-kontak', 'gesekan-dua-arah', 'gerak-relatif-lab'],
  },
  {
    id: 'syarat-kontak',
    title: 'Batas Gaya Normal ($N \\ge 0$) & Tali Tegang ($T \\ge 0$)',
    category: 'pengembangan',
    summary:
      'Model tetap valid hanya jika kedua balok tidak melayang ($N_i > 0$) dan tali tidak mengendor ($T \\ge 0$). Percepatan ke kiri yang terlalu besar dapat melepas kontak balok dari bidang miring.',
    equations: ['N = m(g\\cos\\theta + a_{\\text{kanan}}\\sin\\theta)', 'a_{\\text{kiri, maks}} = g\\cot\\theta'],
    connectsTo: ['gesekan-dua-arah'],
  },
  {
    id: 'gesekan-dua-arah',
    title: 'Rentang Kestabilan dengan Gesekan Statis',
    category: 'pengembangan',
    summary:
      'Jika lereng kasar ($\\mu_s > 0$), kesetimbangan relatif tidak lagi terjadi pada satu nilai $a$ tunggal, melainkan membentuk rentang $[a_{\\min}, a_{\\max}]$ saat arah gaya gesek membalik.',
    equations: ['|f_s| \\le \\mu_s N'],
    connectsTo: ['rekoil-kereta'],
  },
  {
    id: 'resultan-katrol',
    title: 'Gaya Reaksi pada Poros Katrol',
    category: 'pengembangan',
    summary:
      'Dua segmen tali menarik katrol membentuk sudut geometris tertentu. Resultan gaya tali pada poros katrol bergantung pada selisih sudut $\\beta - \\alpha$ dan tegangan tali $T$.',
    equations: ['F_{\\text{katrol}} = 2T\\sin\\left(\\frac{\\beta - \\alpha}{2}\\right)'],
    connectsTo: ['rekoil-kereta'],
  },
  {
    id: 'rekoil-kereta',
    title: 'Dinamika Terkopel Kereta Bebas (Hukum III & P_x)',
    category: 'pengembangan',
    summary:
      'Jika kereta bebas bergerak di lantai licin, tidak ada gaya eksternal horizontal. Gaya normal dan tegangan tali internal mempercepat kereta berlawanan arah gerak horizontal balok agar pusat massa sistem tetap.',
    equations: ['(M+m_1+m_2)a_M = (m_1\\cos\\alpha + m_2\\cos\\beta)a_{\\text{rel}}'],
    connectsTo: ['gerak-relatif-lab'],
  },
  {
    id: 'usaha-energi-fiktif',
    title: 'Teorema Usaha-Energi Kerangka Non-Inersia',
    category: 'pengembangan',
    summary:
      'Medan gaya fiktif konstan $-m\\vec{a}$ bersifat konservatif seperti gravitasi semu $\\vec{g}_{\\text{eff}} = (-a, -g)$. Perubahan energi kinetik relatif sama dengan usaha gravitasi ditambah usaha gaya fiktif.',
    equations: ['W_{\\text{grav}} + W_{\\text{fiktif}} = \\Delta K_{\\text{rel}}'],
    connectsTo: ['gerak-relatif-lab'],
  },
  {
    id: 'gerak-relatif-lab',
    title: 'Transformasi Kecepatan Kerangka Tanah (Inersia)',
    category: 'pengembangan',
    summary:
      'Untuk memperoleh kecepatan absolut balok terhadap tanah, jumlahkan secara vektor kecepatan kereta dan kecepatan relatif balok: $\\vec{v}_{\\text{tanah}} = \\vec{v}_{\\text{kereta}} + \\vec{v}_{\\text{rel}}$.',
    equations: ['\\vec{v}_1 = (a t - v_{\\text{rel}}\\cos\\alpha)\\hat{i} + (v_{\\text{rel}}\\sin\\alpha)\\hat{j}'],
    connectsTo: [],
  },
];

export const THEORY_SECTIONS: TheorySection[] = [
  {
    number: 1,
    id: 'pengantar-fenomena',
    title: '01. Pengantar Fenomena Fisika pada Soal Nomor 5',
    subtitle: 'Mengapa balok di atas bidang miring licin bisa tidak meluncur saat kereta dipacu?',
    content: [
      'Bayangkan Anda berdiri di dalam kereta api yang sedang diam, lalu kereta tiba-tiba dipercepat ke kanan. Tanpa berpegangan, tubuh Anda terasa terdorong ke kiri. Dalam Fisika, sensasi dorongan ke belakang arah percepatan itu bukanlah gaya baru dari luar, melainkan kecenderungan inersia massa tubuh Anda untuk mempertahankan keadaan geraknya.',
      'Pada Soal Nomor 5 OSK Fisika SMA 2026, dua balok $m_1$ dan $m_2$ diletakkan di atas dua bidang miring licin (bersudut $\\alpha$ dan $\\beta$) yang menyatu pada sebuah kereta beroda dan dihubungkan tali melalui katrol puncak. Jika kereta diam, balok pasti meluncur karena tidak ada gesekan. Namun ketika kereta dipercepat ke kanan sebesar $a = 1{,}1g$, muncul keseimbangan baru sehingga kedua balok tetap diam relatif terhadap kereta.',
    ],
    visualType: 'source_system',
    visualCaption: 'Geometri sistem kereta ganda Soal Nomor 5 OSK Fisika 2026 dengan sudut lereng kiri α dan lereng kanan β.',
    narratorScript:
      'Selamat datang di ruang pembinaan Olimpiade Fisika bersama Mister Jo. Perhatikan sistem pada Soal Nomor 5. Sekilas terlihat mustahil dua benda di atas permukaan licin dapat diam tanpa tergelincir. Kuncinya terletak pada percepatan kereta ke kanan sebesar satu koma satu g, yang mengubah kondisi kesetimbangan relatif kedua benda.',
  },
  {
    number: 2,
    id: 'pengetahuan-awal',
    title: '02. Pengetahuan Awal yang Wajib Dikuasai',
    subtitle: 'Fondasi vektor, trigonometri segitiga, dan Hukum Newton dasar',
    content: [
      'Sebelum menurunkan persamaan sistem terkopel, pastikan Anda telah menguasai tiga kompetensi dasar: (1) menguraikan gaya vertikal dan horizontal pada sumbu miring bersudut $\\theta$; (2) identitas segitiga siku-siku $3$-$4$-$5$ di mana $\\sin\\alpha = 3/5$ otomatis memberi $\\cos\\alpha = 4/5$; serta (3) memahami bahwa benda yang diam relatif terhadap kereta yang dipercepat sesungguhnya sedang bergerak dengan percepatan yang sama dengan kereta terhadap tanah.',
    ],
    visualType: 'frame_comparison',
    visualCaption: 'Perbandingan sudut pandang pengamat di tanah (inersia) dan pengamat di atas kereta (non-inersia).',
    narratorScript:
      'Sebelum masuk ke persamaan, ingat aturan emas dari Mister Jo: jangan pernah menebak komponen sinus atau kosinus dari hafalan. Selalu periksa sudut yang dibentuk terhadap garis horizontal atau vertikal agar proyeksi gaya Anda bebas kesalahan.',
  },
  {
    number: 3,
    id: 'definisi-besaran',
    title: '03. Definisi Istilah dan Besaran Fisika',
    subtitle: 'Membedakan kerangka inersia, kerangka dipercepat, gaya nyata, dan gaya fiktif',
    content: [
      'Kerangka acuan inersia adalah kerangka acuan yang diam atau bergerak dengan kecepatan konstan terhadap bintang jauh (dalam soal mekanika tanah dianggap inersia). Kerangka acuan non-inersia adalah kerangka yang mengalami percepatan $\\vec{a}_{\\text{kerangka}}$, seperti kereta pada Soal Nomor 5.',
      'Gaya nyata adalah interaksi fisis akibat gravitasi ($W = mg$), kontak permukaan ($N$), atau tarikan tali ($T$). Gaya fiktif (pseudo-force) $\\vec{F}_{\\text{fiktif}} = -m\\vec{a}_{\\text{kerangka}}$ adalah suku koreksi matematis yang hanya muncul jika kita memilih menganalisis gerak dari dalam kerangka yang dipercepat.',
    ],
    visualType: 'pseudo_force_vector',
    visualCaption: 'Arah gaya fiktif selalu berlawanan dengan arah vektor percepatan kerangka acuan.',
    narratorScript:
      'Bedakan dengan tegas antara gaya nyata dan gaya fiktif. Pada pengamat di tanah, gaya fiktif tidak ada; yang ada hanyalah gaya berat, gaya normal, dan tegangan tali yang menghasilkan percepatan total ke kanan sebesar a.',
  },
  {
    number: 4,
    id: 'konsep-fundamental',
    title: '04. Konsep Fundamental Kesetimbangan Relatif',
    subtitle: 'Apa arti fisis kalimat "m₁ maupun m₂ tidak bergerak relatif terhadap kereta"?',
    content: [
      'Dalam kerangka tanah (inersia), kalimat tersebut berarti percepatan $m_1$ sama persis dengan percepatan kereta, yaitu $\\vec{a}_1 = \\vec{a}_2 = (a, 0)$ ke arah kanan, tanpa komponen percepatan vertikal maupun percepatan sepanjang lereng.',
      'Dalam kerangka kereta (non-inersia), koordinat relatif $s_1$ dan $s_2$ di sepanjang lereng tidak berubah terhadap waktu, sehingga kecepatan relatif $v_{\\text{rel}} = 0$ dan percepatan relatif $a_{\\text{rel}} = 0$. Kondisi ini mengubah persoalan dinamika bergerak menjadi persoalan statika ekuivalen di dalam kereta.',
    ],
    visualType: 'fbd_m1_m2',
    visualCaption: 'Diagram benda bebas (FBD) terpisah untuk m₁ di lereng kiri dan m₂ di lereng kanan dalam kerangka kereta.',
    narratorScript:
      'Kunci pembacaan soal adalah frasa tidak bergerak relatif terhadap kereta. Artinya, di dalam kerangka kereta, resultan seluruh gaya nyata ditambah gaya fiktif yang bekerja pada masing-masing balok harus sama dengan nol.',
  },
  {
    number: 5,
    id: 'hukum-prinsip',
    title: '05. Hukum dan Prinsip Fisika yang Berlaku',
    subtitle: 'Hukum II Newton pada Kerangka Non-Inersia dan Kendala Katrol Ideal',
    content: [
      'Tiga prinsip utama bekerja serentak pada sistem Soal Nomor 5: Pertama, Hukum II Newton dalam bentuk kerangka dipercepat: $\\sum \\vec{F}_{\\text{nyata}} + \\vec{F}_{\\text{fiktif}} = m \\vec{a}_{\\text{rel}}$. Kedua, sifat katrol licin tak bermassa dan tali tak bermassa sehingga tegangan tali di kiri dan kanan katrol identik ($T_1 = T_2 = T$). Ketiga, syarat kontak permukaan ($N_1 > 0, N_2 > 0$) dan tali tegang ($T \\ge 0$).',
    ],
    formulaCard: {
      label: 'PRINSIP KERANGKA NON-INERSIA',
      latex: '\\sum \\vec{F}_{\\text{nyata}} - m\\vec{a}_{\\text{kereta}} = m\\vec{a}_{\\text{rel}}',
      variables: [
        { symbol: '\\sum \\vec{F}_{\\text{nyata}}', meaning: 'Resultan gaya gravitasi, normal, dan tali', unit: 'N' },
        { symbol: '-m\\vec{a}_{\\text{kereta}}', meaning: 'Gaya fiktif berlawanan arah percepatan kereta', unit: 'N' },
        { symbol: '\\vec{a}_{\\text{rel}}', meaning: 'Percepatan benda relatif terhadap kereta', unit: 'm/s²' },
      ],
      condition: 'Berlaku untuk kerangka kereta yang bertranslasi lurus dengan percepatan seragam.',
    },
    visualType: 'pulley_constraint',
    visualCaption: 'Kendala panjang tali tetap (s₁ + s₂ = L) dan kesamaan tegangan tali pada katrol ideal.',
    narratorScript:
      'Karena katrol dianggap tidak bermassa dan tanpa gesekan, momen inersia katrol sama dengan nol. Akibatnya tegangan tali di sisi kiri dan sisi kanan katrol memiliki besar yang tepat sama.',
  },
  {
    number: 6,
    id: 'penurunan-persamaan',
    title: '06. Penurunan Persamaan Matematis Lengkap',
    subtitle: 'Derivasi aljabar dari sumbu lereng kiri α dan lereng kanan β',
    content: [
      'Perhatikan orientasi bidang miring pada Soal Nomor 5: dari katrol puncak, lereng kiri naik ke arah kiri-atas dengan sudut $\\alpha$ terhadap horizontal, sedangkan lereng kanan turun ke arah kanan-bawah dengan sudut $\\beta$ terhadap horizontal.',
      'Untuk $m_1$ di lereng kiri: gaya berat $m_1 g$ menarik ke bawah-kanan (menuju katrol) dengan komponen $m_1 g\\sin\\alpha$, sementara gaya fiktif $m_1 a$ ke kiri mendorong ke atas-kiri (menjauhi katrol) dengan komponen $m_1 a\\cos\\alpha$. Agar seimbang relatif, tali harus menarik $m_1$ menuju katrol: $T = m_1(a\\cos\\alpha - g\\sin\\alpha)$.',
      'Untuk $m_2$ di lereng kanan: gaya berat $m_2 g$ menarik ke bawah-kanan (menjauhi katrol) dengan komponen $m_2 g\\sin\\beta$, sementara gaya fiktif $m_2 a$ ke kiri menarik ke atas-kiri (menuju katrol) dengan komponen $m_2 a\\cos\\beta$. Agar seimbang relatif, tali harus menahan $m_2$ menuju katrol: $T = m_2(g\\sin\\beta - a\\cos\\beta)$.',
    ],
    formulaCard: {
      label: 'RUMUS UTAMA KESETIMBANGAN RELATIF SOAL 5',
      latex: 'm_1(a\\cos\\alpha - g\\sin\\alpha) = m_2(g\\sin\\beta - a\\cos\\beta)',
      variables: [
        { symbol: 'm_1, m_2', meaning: 'Massa balok pada lereng kiri dan kanan', unit: 'kg' },
        { symbol: '\\alpha, \\beta', meaning: 'Sudut kemiringan lereng kiri dan kanan terhadap horizontal', unit: 'rad / °' },
        { symbol: 'a', meaning: 'Percepatan horizontal kereta ke arah kanan', unit: 'm/s²' },
        { symbol: 'g', meaning: 'Percepatan gravitasi bumi', unit: 'm/s²' },
      ],
      condition: 'Valid saat permukaan licin, tali tegang (T > 0), dan kedua balok tetap menyentuh lereng (N₁, N₂ > 0).',
    },
    visualType: 'fbd_m1_m2',
    visualCaption: 'Uraian vektor sejajar bidang (û) dan tegak lurus bidang (n̂) pada kedua benda.',
    narratorScript:
      'Perhatikan tanda setiap komponen gaya dengan teliti. Pada lereng kiri, gaya fiktif menarik benda menjauhi katrol, sedangkan gravitasi menarik menuju katrol. Pada lereng kanan, gravitasi menarik menjauhi katrol, sedangkan gaya fiktif menarik menuju katrol.',
  },
  {
    number: 7,
    id: 'makna-variabel',
    title: '07. Penjelasan Makna Fisis Setiap Variabel',
    subtitle: 'Membaca arti suku (a cos α − g sin α) dan (g sin β − a cos β)',
    content: [
      'Suku $(a\\cos\\alpha - g\\sin\\alpha)$ menyatakan percepatan efektif yang mendorong $m_1$ menjauhi katrol ke arah kiri-atas. Jika suku ini bernilai positif, maka gaya fiktif cukup kuat mengangkat $m_1$ ke kiri-atas sehingga tali wajib menahannya agar tidak naik. Sebaliknya jika negatif, $m_1$ cenderung turun ke kanan-bawah menuju katrol sehingga tidak lagi menarik tali ke arah kiri-atas.',
      'Demikian pula pada $m_2$: suku $(g\\sin\\beta - a\\cos\\beta)$ menyatakan kecenderungan $m_2$ meluncur turun menjauhi katrol. Jika percepatan $a$ terlalu besar hingga $a > g\\tan\\beta$, maka gaya fiktif mendorong $m_2$ naik menuju katrol dan tali menjadi kendor kecuali $m_1$ masih menarik lebih kuat.',
    ],
    visualType: 'tension_vs_accel',
    visualCaption: 'Grafik hubungan tegangan tali T terhadap rasio percepatan a/g pada sistem Soal Nomor 5.',
    narratorScript:
      'Setiap suku aljabar dalam Fisika memiliki cerita fisis. Suku a kosinus alfa dikurangi g sinus alfa bukan sekadar simbol, melainkan ukuran apakah gaya fiktif mampu mengatasi tarikan gravitasi di lereng kiri.',
  },
  {
    number: 8,
    id: 'analisis-dimensi',
    title: '08. Analisis Dimensi dan Satuan SI',
    subtitle: 'Memeriksa konsistensi persamaan sebelum menghitung angka',
    content: [
      'Setiap suku di ruas kiri dan kanan persamaan utama berbentuk massa dikalikan percepatan: $[m][a] = \\text{M}\\cdot\\text{L}\\cdot\\text{T}^{-2}$, yang berdimensi gaya (Newton, $\\text{kg}\\cdot\\text{m/s}^2$). Fungsi trigonometri $\\sin\\alpha$, $\\cos\\alpha$, $\\sin\\beta$, dan $\\cos\\beta$ tidak berdimensi.',
      'Pada pertanyaan Soal Nomor 5, percepatan dinyatakan sebagai kelipatan $g$ ($a = 1{,}1g$), dan massa diberikan dalam bentuk rasio ($m_1/m_2 = 1$). Karena $g$ dan $m$ saling mencoret di kedua ruas, hasil akhir $10\\sin\\beta - 11\\cos\\beta = 2{,}8$ merupakan besaran tak berdimensi.',
    ],
    visualType: 'normal_graph',
    visualCaption: 'Konsistensi dimensi gaya normal N/mg dan tegangan tali T/mg sebagai fungsi rasio percepatan a/g.',
    narratorScript:
      'Dalam Olimpiade Fisika, biasakan memeriksa dimensi sebelum mengirim jawaban akhir. Apabila suku percepatan dan suku gravitasi dijumlahkan atau dikurangkan, dimensinya harus selalu identik.',
  },
  {
    number: 9,
    id: 'kondisi-penerapan',
    title: '09. Kondisi Penerapan Persamaan',
    subtitle: 'Kapan T ≥ 0 dan kapan persamaan kesetimbangan tunggal berlaku?',
    content: [
      'Agar persamaan $m_1(a\\cos\\alpha - g\\sin\\alpha) = m_2(g\\sin\\beta - a\\cos\\beta)$ menghasilkan konfigurasi tali tegang yang fisis, tegangan tali $T$ harus bernilai non-negatif ($T \\ge 0$). Ini mensyaratkan $a\\cos\\alpha \\ge g\\sin\\alpha$ (atau $a \\ge g\\tan\\alpha$) sekaligus $g\\sin\\beta \\ge a\\cos\\beta$ (atau $a \\le g\\tan\\beta$).',
      'Jika $m_1/m_2$ dan sudut $\\alpha, \\beta$ ditetapkan, maka pada sistem tanpa gesekan hanya ada **satu** nilai percepatan keseimbangan unik: $a_{\\text{eq}} = g \\frac{m_1\\sin\\alpha + m_2\\sin\\beta}{m_1\\cos\\alpha + m_2\\cos\\beta}$. Menariknya, perhatikan bahwa $a_{\\text{eq}}$ selalu berada di antara $g\\tan\\alpha$ dan $g\\tan\\beta$ selama $\\alpha < \\beta$!',
    ],
    formulaCard: {
      label: 'PERCEPATAN KESEIMBANGAN UNIK',
      latex: 'a_{\\text{eq}} = g \\frac{m_1\\sin\\alpha + m_2\\sin\\beta}{m_1\\cos\\alpha + m_2\\cos\\beta}',
      variables: [
        { symbol: 'a_{\\text{eq}}', meaning: 'Percepatan tunggal agar sistem tanpa gesekan diam relatif', unit: 'm/s²' },
        { symbol: 'g\\tan\\alpha < a_{\\text{eq}} < g\\tan\\beta', meaning: 'Syarat agar tali tegang (T > 0) untuk α < β', unit: 'm/s²' },
      ],
      condition: 'Berlaku bila lereng licin sempurna dan sudut α < β.',
    },
    visualType: 'stability_bounds',
    visualCaption: 'Wilayah kestabilan percepatan kereta saat tali tegang dan kedua benda tetap kontak dengan lereng.',
    narratorScript:
      'Perhatikan syarat kritis ini: agar tali tidak kendor, percepatan kereta harus berada di antara g tangen alfa dan g tangen beta. Inilah mengapa pada Soal Nomor 5 nilai beta pasti lebih besar daripada nilai alfa.',
  },
  {
    number: 10,
    id: 'batas-keberlakuan',
    title: '10. Batas Keberlakuan Model Fisika',
    subtitle: 'Apa yang terjadi jika percepatan kereta berbalik arah atau terlalu ekstrem?',
    content: [
      'Model kesetimbangan pada Soal Nomor 5 memiliki tiga batas keberlakuan yang sering diuji dalam soal variasi OSK: (1) Jika kereta dipercepat ke **kiri**, komponen normal $N_i = m_i(g\\cos\\theta_i - a_{\\text{kiri}}\\sin\\theta_i)$ mengecil hingga nol pada $a_{\\text{kiri}} = g\\cot\\theta_i$, menyebabkan balok terangkat lepas kontak dari lereng.',
      '(2) Jika percepatan ke kanan $a > a_{\\text{eq}}$, kedua benda tidak lagi diam relatif, melainkan mengalami percepatan relatif $a_{\\text{rel}} \\neq 0$ sepanjang tali. (3) Jika massa katrol atau gesekan tidak dapat diabaikan, maka $T_1 \\neq T_2$ atau muncul rentang percepatan kesetimbangan.',
    ],
    visualType: 'stability_bounds',
    visualCaption: 'Batas kritis lepas kontak (N = 0) ketika percepatan berbalik arah ke kiri.',
    narratorScript:
      'Model ideal selalu punya batas. Saat percepatan berbalik ke kiri, gaya fiktif mengarah ke kanan dan mulai mengangkat balok dari permukaan bidang miring. Begitu gaya normal menjadi nol, persamaan bidang miring tidak berlaku lagi.',
  },
  {
    number: 11,
    id: 'hubungan-konsep-pendukung',
    title: '11. Hubungan dengan Konsep Pendukung',
    subtitle: 'Menghubungkan Dinamika Newton dengan Momentum, Usaha-Energi, dan Kinematika Relatif',
    content: [
      'Konsep Soal Nomor 5 dapat dikembangkan secara alami ke bab Fisika lainnya: (a) Jika kereta tidak didorong paksa melainkan bebas bergerak di lantai licin, hukum kekekalan momentum horizontal mengaitkan percepatan mundur kereta $a_M$ dengan percepatan relatif balok $a_{\\text{rel}}$; (b) Jika kedua benda bergerak sejauh $d$, medan gaya fiktif konstan memungkinkan penggunaan teorema usaha-energi dalam kerangka non-inersia; (c) Kecepatan absolut terhadap tanah diperoleh dengan penjumlahan vektor $\\vec{v}_{\\text{tanah}} = \\vec{v}_{\\text{kereta}} + \\vec{v}_{\\text{rel}}$.',
    ],
    visualType: 'recoil_momentum',
    visualCaption: 'Keterkaitan Soal 5 dengan gerak rekoil kereta bebas di lantai datar licin akibat gaya internal N₁, N₂, dan T.',
    narratorScript:
      'Di tingkat Olimpiade, satu konfigurasi mekanika dapat diuji dari berbagai sudut pandang: hukum Newton, hukum kekekalan momentum saat kereta bebas bergerak, hingga teorema usaha-energi di kerangka non-inersia.',
  },
  {
    number: 12,
    id: 'penerapan-nyata',
    title: '12. Contoh Penerapan dalam Fenomena Nyata',
    subtitle: 'Dari akselerometer mekanik hingga kestabilan muatan di kendaraan berkecepatan tinggi',
    content: [
      'Prinsip kesetimbangan relatif pada kerangka dipercepat dipakai dalam perancangan akselerometer mekanik sederhana, penentuan sudut kemiringan wadah cairan di atas kereta cepat, hingga analisis kestabilan muatan dua blok yang saling terikat di atas truk pengangkut yang mengerem atau berakselerasi mendadak.',
    ],
    visualType: 'energy_work',
    visualCaption: 'Medan gravitasi efektif g_eff = √(g² + a²) yang miring terhadap vertikal dalam kendaraan yang dipercepat.',
    narratorScript:
      'Dalam rekayasa transportasi dan instrumentasi, konsep gravitasi efektif mempermudah perancangan sistem pengaman muatan agar barang tidak bergeser saat kendaraan mengalami akselerasi besar.',
  },
  {
    number: 13,
    id: 'contoh-perhitungan',
    title: '13. Contoh Perhitungan Bertahap Soal Nomor 5 OSK 2026',
    subtitle: 'Penyelesaian resmi lengkap langkah demi langkah dari soal sumber',
    content: [
      'Diketahui $\\sin\\alpha = 3/5 \\implies \\cos\\alpha = 4/5$, percepatan kereta ke kanan $a = 1{,}1g$, dan $m_1 = m_2 = m$. Pada $m_1$: $T = m(a\\cos\\alpha - g\\sin\\alpha) = m g(1{,}1 \\times 0{,}8 - 0{,}6) = 0{,}28\\,mg$.',
      'Pada $m_2$: $T = m(g\\sin\\beta - a\\cos\\beta) = mg(\\sin\\beta - 1{,}1\\cos\\beta)$. Karena tegangan tali sama, maka $\\sin\\beta - 1{,}1\\cos\\beta = 0{,}28$. Dengan mengalikan kedua ruas oleh $10$, kita peroleh tepat $10\\sin\\beta - 11\\cos\\beta = 2{,}8$.',
    ],
    formulaCard: {
      label: 'VERIFIKASI NUMERIK SOAL NOMOR 5',
      latex: '10\\sin\\beta - 11\\cos\\beta = 11\\cos\\alpha - 10\\sin\\alpha = 11(0{,}8) - 10(0{,}6) = 2{,}8',
      variables: [
        { symbol: 'T / (mg)', meaning: 'Tegangan tali ternormalisasi sebesar 0,28', unit: '-' },
        { symbol: '\\beta', meaning: 'Sudut lereng kanan unik yang memenuhi ≈ 58,6°', unit: '°' },
      ],
      condition: 'Nilai T > 0 memastikan tali benar-benar tegang dan hasil 2,8 valid secara fisis.',
    },
    visualType: 'source_system',
    visualCaption: 'Ilustrasi kondisi setimbang Soal 5 saat a = 1,1g dan tegangan tali T = 0,28 mg.',
    narratorScript:
      'Perhatikan betapa elegan hasil akhirnya. Tanpa perlu mencari besar sudut beta secara eksplisit, eliminasi tegangan tali langsung menghasilkan nilai sepuluh sinus beta dikurangi sebelas kosinus beta sama dengan dua koma delapan.',
  },
  {
    number: 14,
    id: 'strategi-olimpiade',
    title: '14. Strategi Penyelesaian Soal Olimpiade',
    subtitle: 'Metode Mister Jo untuk menaklukkan soal dinamika terkopel dalam waktu cepat',
    content: [
      'Pertama, selalu tentukan kerangka acuan paling sederhana: untuk kesetimbangan relatif terhadap kereta, kerangka non-inersia kereta jauh lebih cepat daripada memecah $x$-$y$ di kerangka tanah. Kedua, cek tanda tegangan tali $T > 0$ dan gaya normal $N > 0$ sebagai uji kewajaran fisis. Ketiga, perhatikan bentuk pertanyaan aljabar seperti $10\\sin\\beta - 11\\cos\\beta$: sering kali soal OSK sengaja meminta kombinasi linear agar Anda tidak perlu menggunakan kalkulator invers trigonometri!',
    ],
    visualType: 'normal_graph',
    visualCaption: 'Peta pengecekan cepat: pilih kerangka → gambar FBD → tulis persamaan sumbu lereng → uji tanda T dan N.',
    narratorScript:
      'Strategi penting dari Mister Jo: apabila soal meminta bentuk aljabar trigonometri seperti sepuluh sinus beta minus sebelas kosinus beta, jangan buru-buru mencari nilai beta satu per satu. Biarkan bentuk aljabar itu terbentuk alami dari eliminasi tegangan tali.',
  },
  {
    number: 15,
    id: 'kesalahan-konseptual',
    title: '15. Kesalahan Konseptual yang Sering Dilakukan Siswa',
    subtitle: '5 jebakan fatal dalam analisis kerangka non-inersia dan sistem katrol',
    content: [
      'Kesalahan 1: Menganggap gaya normal tetap $N = mg\\cos\\theta$! Padahal gaya fiktif horizontal memiliki komponen tegak lurus lereng sebesar $+ma\\sin\\theta$ (jika percepatan ke kanan), sehingga $N = m(g\\cos\\theta + a\\sin\\theta)$. Kesalahan 2: Menggambar arah gaya fiktif searah percepatan kereta, padahal harus berlawanan arah ($-m\\vec{a}$).',
      'Kesalahan 3: Lupa memeriksa apakah tali tegang ($T \\ge 0$) atau mengira tali dapat mendorong balok. Kesalahan 4: Menggunakan kerangka non-inersia sekaligus tetap memakai percepatan total tanah di ruas kanan (penghitungan ganda!). Kesalahan 5: Membulatkan angka di tengah perhitungan sebelum langkah terakhir.',
    ],
    visualType: 'pseudo_force_vector',
    visualCaption: 'Perbandingan FBD benar vs kekeliruan umum pada proyeksi gaya normal dan arah gaya fiktif.',
    narratorScript:
      'Hindari lima kesalahan klasik ini: jangan lupa komponen gaya fiktif pada gaya normal, jangan menggandakan perhitungan inersia, dan jangan pernah membulatkan hasil di tengah jalan. Simpan seluruh presisi angka hingga langkah akhir.',
  },
];
