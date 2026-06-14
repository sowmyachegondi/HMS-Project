import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db.js';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Split by semicolon and execute each statement (skip USE after first)
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    if (stmt.toUpperCase().includes('CREATE DATABASE')) continue;
    try {
      await pool.query(stmt + ';');
      console.log('Executed:', stmt.substring(0, 50) + '...');
    } catch (err) {
      if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_TABLE') {
        console.log('Table exists, skipping:', err.message);
      } else {
        console.error('Error:', err.message);
      }
    }
  }

  // Ensure photo_base64, student_signature_base64, caste columns exist (for existing DBs)
  try {
    await pool.query('ALTER TABLE students ADD COLUMN photo_base64 LONGTEXT');
    console.log('Added column photo_base64');
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('photo_base64:', err.message);
  }
  try {
    await pool.query('ALTER TABLE students ADD COLUMN student_signature_base64 LONGTEXT');
    console.log('Added column student_signature_base64');
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('student_signature_base64:', err.message);
  }
  try {
    await pool.query('ALTER TABLE students ADD COLUMN caste VARCHAR(100)');
    console.log('Added column caste');
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('caste:', err.message);
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const studentPass = await bcrypt.hash('student123', 10);

  // Insert admin
  await pool.query(
    `INSERT IGNORE INTO admins (email, password, name) VALUES (?, ?, ?)`,
    ['admin@bapatlahostel.edu', hashedPassword, 'Hostel Admin']
  );

  // Insert students and student_auth from provided data
  const students = [
    ['Y22ACM406','A. Sravani',4,'AIML','A. Siva Reddy','A. Padma','6281728186','9593456789','7730956476','Chimata','A+','781868680164','UNPAID','2005-07-07'],
    ['Y22ACM417','B. Venkata Lakshmi',4,'AIML','B. Chinna Mastan','B. Aruna Kumari','6304949309','8171216552','8171216552','Challavaripalem','A+','731365595999','UNPAID','2004-07-15'],
    ['Y22ACS153','Puvvadi Mounika',4,'CSE','Puvvadi Mallikarjuna Rao','Puvvadi Sulochana','9130034503','9764885246','7507885246','Vinukonda','B+','589041028629','UNPAID','2005-08-22'],
    ['Y22ADS405','B. Chandra Lekha',4,'DS','B. Satish Krishna','B. Sailaja','6301487737','9848272651','9247350100','Ongole','O+','495249509964','UNPAID','2005-12-04'],
    ['Y22ADS437','Pendyala Charitha',4,'DS','Pendyala Venkata Subbaiah','Pendyala Sumathi','9121692728','8985144079','7207763668','Cheruvukommupalem','O+','913840544726','UNPAID','2005-08-19'],
    ['Y22AEC493','Pundla Sailikhitha',4,'ECE','P. Sreenivasulu','P. Sailaja','7013458309','9441850063','9494254609','Pamur','B+','370223366912','UNPAID','2004-03-20'],
    ['Y22AEC545','Rajaboyina Prameela',4,'ECE','Kiran','Anasurya','8328614480','9948607661','9347563775','Vijayawada','O-','624562348546','UNPAID','2005-09-14'],
    ['Y22AIT401','Durga Sree Gnana Hima Bindu Alapati',4,'IT','Narendra Rao','Vijaya Lakshmi','7842251711','9705088669','9394833509','Bapatla','B+','795785885594','UNPAID','2004-05-23'],
    ['Y22AIT402','Allam Manisha',4,'IT','Allam Sreenivasulu','Allam Lakshmi Devi','9381922890','8109025073','8790370385','Komarole','O-','429408401533','PAID','2005-09-07'],
    ['Y22AIT404','Amruthapudi Deepthi',4,'IT','Amruthapudi Nageswara Rao','Amruthapudi Koteswaramma','6304955281','9248421991','8500532485','Sattenapalli','B+','613067585315','PAID','2004-04-12'],
    ['Y22AIT409','Bathula Sowmya',4,'IT','Bathula Nagaraju','Bathula Madhavi','9177688448','9676188448','9381217070','Donakonda','B+','246404623686','UNPAID','2004-09-26'],
    ['Y22AIT413','Boddu Lakshmi Lavanya',4,'IT','Boddu Balachandra Rao','Boddu Sujatha','9589581123','9000525277','7036892794','Nagayalanka','O-','938921603433','UNPAID','2005-10-15'],
    ['Y22AIT414','Borra Monika',4,'IT','Borra Srinivasa Rao','Borra Rajyalakshmi','9491500297','8008577491','8317562874','Chilakaluripeta','O-','419935089780','UNPAID','2004-01-26'],
    ['Y22AIT417','Chaparla SriLakshmi',4,'IT','Chaparla Naresh','Chaparla Gayatri','6302333071','9985030674','9704727591','Eluru','O+','565652987145','PAID','2004-04-10'],
    ['Y22AIT419','Chegondi Hampi Naga Sowmya',4,'IT','Chegondi Srinivasa Rao','Chegondi Rajini','6304985650','8098765432','9014610132','Machilipatnam','O+','892331348963','PAID','2005-01-21'],
    ['Y22AIT447','Kesanupalli Meghana',4,'IT','Kesanupalli Prasad Rao','Kesanupalli Padmavati','9491543449','9494565211','6301345885','Narasaraopet','A+','577787599434','PAID','2004-04-26'],
    ['Y22AIT459','Kondragunta Deepsika',4,'IT','Kondragunta Krishnaiah','Kondragunta Sunitha','8464997651','8323458923','9985455824','Edumudi','O+','806143952443','PAID','2005-02-09'],
    ['Y22AIT460','Kondru Surekha',4,'IT','Kondru Krishnaiah','Kondru Yogeswari','8374950119','8464855976','7660969566','Tripuranthakam','AB+','866143952343','PAID','2004-11-28'],
    ['Y22AIT512','Sikhakolli Mahima',4,'IT','Sikhakolli Srinivasa Rao','Sikhakolli Rajyalakshmi','7013542553','8125613020','8978625823','Chirala','B+','443973098966','PAID','2004-03-11'],
    ['Y22AME403','Battula Indu',4,'MECH','Ramaiah','Adi Lakshmi','8247031525','9398575063','7989612976','Polepalle','A+','939239674634','UNPAID','2004-10-11'],
    ['Y23ACM461','Polagani Sai Suma Sri',3,'AIML','Polagani Siva Naga Ragu','Polagani Aruna','8125261424','8374756561','9154028163','Mangalagiri, Guntur','B+','659292805099','UNPAID',null],
    ['Y23ACM470','Sami Tanmayi',3,'AIML','Sami Venkata Subrahmanyam','Sami Padmaja','7671871059','9000699865','9381788721','Podili, Prakasam','O','536710976469','UNPAID',null],
    ['Y23ACM464','Potluri Sai Vyshnavi',3,'AIML','Potluri Govindarajulu','Potluri Saidulu','9182480918','8019935970','9154296522','Rajampalli, Prakasam','O+','770300142792','UNPAID',null],
    ['Y23ACM482','Vangapati Adilakshmi',3,'AIML','Vangapati Chennakesavulu','Vangapati Radha','7093200599','9573444551','9705419218','Boganampadu, Prakasam','B+','568406960049','UNPAID',null],
    ['Y23ACM451','Nemala Naga Sai Lakshmi',3,'AIML','N. Gopi','N. Devi','9014748996','9391002591','8780519821','Kakinada',null,'577613920416','UNPAID',null],
    ['Y23ACM472','Shaik Baji',3,'AIML','Shaik Anarvali','Shaik Mastandi','7672001783','9550858967','9705419218','Gundlapalli, Palnadu','B+','970126872093','UNPAID',null],
    ['Y23AEC513','Prasanna Mothukuri',3,'ECE','Brahmam Mothukuri','Sampurna Mothukuri','9381383179','7893183402',null,'Palnadu','A+','995235577484','UNPAID',null],
    ['Y23ACS409','B. Jahnavi',3,'CSE','B. Raghavendra Rao','B. Lakshmi','7995909630','9908065634',null,'T.N. Valasa',null,'436352810551','UNPAID',null],
    ['Y23ADS419','CH.N.V. Harini',3,'Data Science','CH. Srinivasa Rao','CH. Sailaja','9014983879','6304039250','9440713678','Jaggayyapeta','O+','564342773973','UNPAID',null],
    ['Y23ACS410','B. Sonali',3,'CSE','B. Kishor','B. Madhavi','8019238327','9440140112','9949517534','Srikakulam','O+','297252115349','UNPAID',null],
    ['Y23ACS482','Korrapati Sanjana',3,'CSE','Korrapati Sheshaiah','Korrapati Aruna','9392051029','9652745367',null,'Prakasam','B+','401652284787','UNPAID',null],
  ];

  for (const [regd_no, full_name, year, branch, father_name, mother_name, student_phone, father_phone, mother_phone, address, blood_group, aadhaar_no, payment_status, dob] of students) {
    await pool.query(
      `INSERT IGNORE INTO students (regd_no, full_name, father_name, mother_name, student_phone, father_phone, mother_phone, address, blood_group, aadhaar_no, payment_status, branch, year, dob, caste, created_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [regd_no, full_name, father_name, mother_name, student_phone, father_phone, mother_phone, address, blood_group, aadhaar_no, payment_status, branch, year, dob || null, '']
    );
    await pool.query(
      `INSERT IGNORE INTO student_auth (regd_no, password) VALUES (?, ?)`,
      [regd_no, studentPass]
    );
  }

  // Rooms from CSV
  const roomLines = fs.readFileSync(path.join(__dirname, '../../room_details data.csv'), 'utf8').split('\n').slice(1);
  for (const line of roomLines) {
    const [room_number, beds, cots, fans, tube_lights, chairs, dustbin, washrooms, foot_stand, mirrors, shelf, max_sharing, bed_lights] = line.split(',');
    if (!room_number) continue;
    await pool.query(
      `INSERT IGNORE INTO rooms (room_number, beds, cots, fans, tube_lights, chairs, dustbin, washrooms, foot_stand, mirrors, shelf, max_sharing, bed_lights) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [room_number, beds||4, cots||2, fans||2, tube_lights||2, chairs||2, dustbin||1, washrooms||'ATTACHED', foot_stand||1, mirrors||1, shelf||4, max_sharing||4, bed_lights||2]
    );
  }

  // Room allotments from mess bill (room_no mapping) - unique bed_number per room
  const allotments = [
    ['Y22ACM406','202','A. Sravani','1'],['Y22ACM417','204','B. Venkata Lakshmi','1'],['Y22ACS153','203','Puvvadi Mounika','1'],
    ['Y22ADS405','202','B. Chandra Lekha','2'],['Y22ADS437','205','Pendyala Charitha','1'],['Y22AEC493','111','Pundla Sailikhitha','1'],
    ['Y22AEC545','109','Rajaboyina Prameela','1'],['Y22AIT402','202','Allam Manisha','3'],['Y22AIT404','131','Amruthapudi Deepthi','1'],
    ['Y22AIT409','130','Bathula Sowmya','1'],['Y22AIT414','110','Borra Monika','1'],['Y22AIT417','131','Chaparla SriLakshmi','2'],
    ['Y22AIT419','110','Chegondi Hampi Naga Sowmya','2'],['Y22AIT447','203','Kesanupalli Meghana','2'],['Y22AIT460','207','Kondru Surekha','1'],
    ['Y23ACM461','210','Polagani Sai Suma Sri','1'],['Y23ACM470','FF02','Sami Tanmayi','1'],['Y23ACM464','201','Potluri Sai Vyshnavi','1'],
    ['Y23ACM482','FF02','Vangapati Adilakshmi','2'],['Y23ACM451','202','Nemala Naga Sai Lakshmi','4'],['Y23ACM472','201','Shaik Baji','2'],
    ['Y23AEC513','110','Prasanna Mothukuri','3'],['Y23ACS409','112','B. Jahnavi','1'],['Y23ADS419','FF01','CH.N.V. Harini','1'],
    ['Y23ACS410','204','B. Sonali','1'],['Y23ACS482','204','Korrapati Sanjana','2'],
  ];
  for (const [regd_no, room_number, student_name, bed_number] of allotments) {
    await pool.query(
      `INSERT IGNORE INTO room_allotments (room_number, regd_no, student_name, bed_number) VALUES (?, ?, ?, ?)`,
      [room_number, regd_no, student_name, bed_number]
    ).catch(() => {});
  }

  // Mess menu
  const menuDays = [
    ['MON','Coffee + Milk + Idli','Rice + Dal + Lady\'s Finger Fry','Tea + Milk + Maggie','Rice + Drumstick Curry'],
    ['TUE','Coffee + Milk + Pulihora','Rice + Dal + Potato Fry','Tea + Milk + Banana','Rice + Beans Curry'],
    ['WED','Coffee + Milk + Dosa','Rice + Dal + Cabbage Fry','Tea + Milk + Bakery Item','Chicken Curry + Paneer Curry'],
    ['THU','Coffee + Milk + Punugulu','Rice + Dal + Bitter Gourd Fry','Tea + Milk + Fruit','Chapati + Potato Curry + Ice Cream'],
    ['FRI','Coffee + Milk + Rice Item','Rice + Dal + Brinjal Fry','Tea + Milk + Sweet','Cauliflower Curry'],
    ['SAT','Coffee + Milk + Uttappam','Rice + Dal + Potato Curry','Tea + Milk + Punugulu','Rice + Chamdumpa Curry'],
    ['SUN','Coffee + Milk + Puri/Vada','Pulav','Tea + Milk + Bajji','Egg Curry / Tomato Curry'],
  ];
  for (const [day_name, breakfast, lunch, snacks, dinner] of menuDays) {
    await pool.query(
      `INSERT INTO mess_menu (day_name, breakfast, lunch, snacks, dinner) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE breakfast=VALUES(breakfast), lunch=VALUES(lunch), snacks=VALUES(snacks), dinner=VALUES(dinner)`,
      [day_name, breakfast, lunch, snacks, dinner]
    );
  }

  // Workers
  const workers = [
    ['Babu','9346695896','Electrician','8:00 AM - 7:00 PM'],
    ['Gafoor','7386505397','Security','6 HRS'],
    ['Mastan','9849420576','Security','6 HRS'],
    ['Ramullamma','6304585210','Cleaner','10:00 AM - 4:00 PM'],
    ['Renukamma','7356201489','Chef','08:00 AM - 4:00 PM'],
  ];
  for (const [name, phone, designation, working_timings] of workers) {
    await pool.query(`INSERT IGNORE INTO workers (name, phone, designation, working_timings) VALUES (?,?,?,?)`, [name, phone, designation, working_timings]);
  }

  // January mess bills
  const messBills = [
    ['Y22ACM406','A. Sravani','4/4','202',9,1170,4289,200,5659],
    ['Y22ACM417','B. Venkata Lakshmi','4/4','204',9,1170,10508,500,12178],
    ['Y22ACS153','Puvvadi Mounika','4/4','203',21,2730,0,0,2730],
    ['Y22ADS405','B. Chandra Lekha','4/4','202',22,2860,0,0,2860],
    ['Y22ADS437','Pendyala Charitha','4/4','205',22,2860,0,0,2860],
    ['Y22AEC493','Pundla Sailikhitha','4/4','111',20,2600,9,0,2609],
    ['Y22AEC545','Rajaboyina Prameela','4/4','109',21,2730,3000,100,5830],
    ['Y22AIT402','Allam Manisha','4/4','202',22,2860,100,0,2960],
    ['Y22AIT404','Amruthapudi Deepthi','4/4','131',23,2990,0,0,2990],
    ['Y22AIT409','Bathula Sowmya','4/4','130',9,1170,3689,150,5009],
    ['Y22AIT414','Borra Monika','4/4','110',23,2990,-1,0,2989],
    ['Y22AIT417','Chaparla SriLakshmi','4/4','131',19,2470,278,0,2748],
    ['Y22AIT419','Chegondi Hampi Naga Sowmya','4/4','110',22,2860,-6,0,2854],
    ['Y22AIT447','Kesanupalli Meghana','4/4','203',10,1300,68,0,1368],
    ['Y22AIT460','Kondru Surekha','4/4','207',13,1690,635,0,2325],
    ['Y23ACM461','Polagani Sai Suma Sri','3/4','210',23,2990,0,0,2990],
    ['Y23ACM470','Sami Tanmayi','3/4','FF02',20,2600,1503,50,4153],
    ['Y23ACM464','Potluri Sai Vyshnavi','3/4','201',23,2990,0,0,2990],
    ['Y23ACM482','Vangapati Adilakshmi','3/4','FF02',21,2730,-6,0,2724],
    ['Y23ACM451','Nemala Naga Sai Lakshmi','3/4','202',17,2210,3689,150,6049],
    ['Y23ACM472','Shaik Baji','3/4','201',21,2730,651,0,3381],
    ['Y23AEC513','Prasanna Mothukuri','3/4','110',21,2730,0,0,2730],
    ['Y23ACS409','B. Jahnavi','3/4','112',18,2340,0,0,2340],
    ['Y23ADS419','CH.N.V. Harini','3/4','FF01',21,2730,150,0,2880],
    ['Y23ACS410','B. Sonali','3/4','204',16,2080,0,0,2080],
    ['Y23ACS482','Korrapati Sanjana','3/4','204',20,2600,34666,1700,38966],
  ];
  for (const [regd_no, student_name, year_branch, room_no, staying_days, mess_amount, old_due, fine, total_amount] of messBills) {
    await pool.query(
      `INSERT INTO mess_bills (regd_no, student_name, year_branch, room_no, month_year, staying_days, mess_amount, old_due, fine, total_amount, remarks) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [regd_no, student_name, year_branch, room_no, 'Jan-2025', staying_days, mess_amount, old_due, fine, total_amount, '/']
    );
  }

  // Demo outing requests (Jan-Feb)
  const outingTypes = ['home','local'];
  const purposes = ['Family visit','Medical','Local shopping','Festival','Personal'];
  const studentRegds = students.slice(0, 20).map(s => s[0]);
  for (let i = 0; i < 30; i++) {
    const regd = studentRegds[Math.floor(Math.random() * studentRegds.length)];
    const [s] = await pool.query('SELECT full_name, branch, year FROM students WHERE regd_no = ?', [regd]);
    const name = s[0]?.full_name || 'Student';
    const branch = s[0]?.branch || 'CSE';
    const year = s[0]?.year != null ? s[0].year : 2;
    const [ra] = await pool.query('SELECT room_number FROM room_allotments WHERE regd_no = ?', [regd]);
    const room_no = ra[0]?.room_number || '101';
    const fromDate = new Date(2025, 0, 1 + Math.floor(Math.random() * 45));
    const toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + Math.floor(Math.random() * 3) + 1);
    await pool.query(
      `INSERT INTO outing_requests (regd_no, student_name, room_no, branch, year, outing_type, purpose, from_date, to_date, phone, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [regd, name, room_no, branch, year, outingTypes[Math.floor(Math.random()*2)], purposes[Math.floor(Math.random()*5)], fromDate, toDate, '9876543210', ['pending','approved','approved'][Math.floor(Math.random()*3)]]
    );
  }

  // Doctor schedule (Mon-Fri available)
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  for (const d of days) {
    await pool.query(`INSERT INTO doctor_schedule (day_name, available, time_slot) VALUES (?,?,?) ON DUPLICATE KEY UPDATE available=VALUES(available)`, [d, d !== 'Saturday', '9:00 AM - 12:00 PM']);
  }

  console.log('Seed completed successfully!');
  console.log('Admin: admin@bapatlahostel.edu / admin123');
  console.log('Student: Y22ACM406 / student123');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
