import React from 'react';
import { Carousel, Collapse, Space } from 'antd';
import Layout from '../components/Layout';
import '../index.css'
import { CalendarOutlined, CompassOutlined, HeartOutlined, MailOutlined, PhoneOutlined, SmileOutlined, StarOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';

const { Panel } = Collapse;
const HomePage = () => {
    return (
        <Layout>

            <Carousel autoplay className='carouselStyle cursor-pointer'>
                <Link to="/preturi">
                    <div className="carouselItem">
                        <img src="assets/acid.jpg" alt="Carousel Image 1" />
                    </div>
                </Link>
                <Link to="/preturi">
                    <div className="carouselItem">

                        <img src="assets/co2fractionat.webp" alt="Carousel Image 2" />
                    </div>
                </Link>
                <Link to="/preturi">
                    <div className="carouselItem">

                        <img src="assets/dermatoscopie.jpeg" alt="Carousel Image 3" />

                    </div>
                </Link>
                <Link to="/preturi">
                    <div className="carouselItem">

                        <img src="assets/epilare.jpg" alt="Carousel Image 4" />
                    </div>
                </Link>
            </Carousel>
            <br></br>
            <Space size={60}>
                <div>
                    <PhoneOutlined className="icons" />
                    <p className='custom-text'>Telefon programări:</p>
                    <p className='custom-text'>0758345402</p>
                </div>
                <div>
                    <MailOutlined className="icons" />
                    <p className='custom-text'>E-mail programări:</p>
                    <p className='custom-text'>programari@dermahealthexpert.ro</p>
                </div>
                <div >
                    <CalendarOutlined className="icons" />
                    <p className='custom-text'>Program clinică:</p>
                    <p className='custom-text'>Luni - Duminică 08:00-21:00</p>
                </div>
                <div >
                    <CompassOutlined className="icons" />
                    <p className='custom-text'>Locație clinică:</p>
                    <p className='custom-text'>Strada Doctor Grigore Mora Nr. 2</p>
                </div>

            </Space>
            <hr></hr>
            <h1 className='heading'>Cine suntem și cu ce ne ocupăm noi?</h1>
            <p className='custom-text2'>Bun venit la Derma Health Clinic, o clinică dermatologică de top și de încredere, unde prioritățile noastre sunt sănătatea și frumusețea pielii dumneavoastră. Suntem mândri să vă oferim servicii de calitate superioară, într-un mediu prietenos și profesional.</p>
            <br></br>
            <p className='custom-text2'>În această clinică, suntem dedicați să vă oferim cele mai bune soluții pentru îngrijirea pielii, menținând în același timp prețuri accesibile pentru toți pacienții noștri. Înțelegem importanța unei îngrijiri de calitate și ne străduim să facem tratamentele dermatologice de top accesibile pentru toți cei care le caută.</p>
            <br></br>
            <p className='custom-text2'>Echipa noastră este formată din specialiști de elită în domeniul dermatologiei, care au dobândit o vastă expertiză și experiență în tratarea diferitelor afecțiuni ale pielii. Fie că aveți nevoie de un consult dermatologic de rutină, de un tratament anti-îmbătrânire sau de soluții personalizate pentru diverse probleme ale pielii, suntem aici să vă ajutăm.</p>
            <br></br>
            <p className='custom-text2'>Ne preocupăm în mod special de tinerețea și sănătatea pielii dumneavoastră. Prin utilizarea celor mai avansate tehnologii și a metodelor de tratament inovatoare, vă oferim soluții eficiente și personalizate pentru a vă menține pielea sănătoasă, frumoasă și strălucitoare. În plus, suntem mereu la curent cu ultimele descoperiri și tendințe în domeniul dermatologiei, pentru a vă oferi cele mai bune opțiuni de tratament disponibile.</p>
            <br></br>
            <p className='custom-text2'>La clinica noastră, clienții noștri sunt pe primul loc, iar satisfacția dumneavoastră este obiectivul nostru principal. Vă invităm să experimentați servicii de înaltă calitate și o atenție deosebită la detalii, într-un mediu confortabil și primitor.</p>
            <br></br>
            <hr></hr>
            <h1 className='heading'>Sănătatea pielii tale pe primul loc pentru noi!</h1>
            <Space size={130}>
                <div>
                    <p className='custom-text'>Aparatură și tehnologii de top</p>
                    <p className='custom-text2'>Laser vascular Vbeam, Laser eCO2 lutronic, Dermapen, OxyGeneo și multe altele. </p>
                </div>
                <div>
                    <p className='custom-text'>Metode inovative</p>
                    <p className='custom-text2'>Tehnici noi de injectare, fără reacții adverse, fără durere, cu rezultate cu aspect natural. </p>
                </div>
                <div >
                    <p className='custom-text'>Injectabile premium</p>
                    <p className='custom-text2'>Cele mai noi inovații în mixurile de injectare cu acid hialuronic și toxină, cu rezultate vizibile și de durată.</p>
                </div>
            </Space>
            <hr></hr>
            <h1 className='heading'>Despre tehnologiile și aparatura folosite de noi</h1>
            <hr></hr>
            <Collapse accordion>
                <Panel header="Laserul vascular pulsed dye laser" className='heading2'>
                    <p className='custom-text2'>Laserul Vbeam, cunoscut și sub denumirea de laser vascular pulsed dye laser, utilizează o lungime de undă de 595nm. Această energie emisă de laser este absorbită de oxihemoglobină, pigmentul roșu prezent în vasele de sânge. Prin aplicarea tratamentului cu laser Vbeam, vasele de sânge sunt selectiv colabate și coagulate. Datorită eficacității sale, laserul Vbeam este considerat metoda standard de aur în tratarea leziunilor vasculare.</p>
                    <br></br>
                    <p className='custom-text2'>Primul strat al pielii (epidermul) nu este afectat în urma procedurii deoarece aparatul are integrat Dynamic Cooling Device. Acesta protejează pielea în timpul tratamentului și scade semnificativ timpul de tratament.</p>
                    <br></br>
                    <p className='custom-text2'>Afecțiunile pe care Laserul Vbeam le tratează: </p>
                    <ul className='custom-list'>
                        <li>Rozacee</li>
                        <li>Angioame cherry, angioame spider</li>
                        <li>Acnee inflamatorie</li>
                        <li>Telangiectazii faciale</li>
                        <li>Telangiectazii corporale (superficiale)</li>
                        <li>Cicatrici postacnee roșii</li>
                        <li>Eritemul postacnee</li>
                        <li>Cicatrici chirurgicale postoperatorii</li>
                        <li>Vergeturi roșii (striae rubrae)</li>
                        <li>Port wine stain</li>
                        <li>Hemangioame infantile</li>
                        <li>Poikilodermia Civatte</li>
                        <li>Veruci</li>
                        <li>Cicatrici hipertrofice, cicatrici keloide (laserul vascular poate fi asociat celorlalte proceduri)</li>
                        <li>Psoriazis (leziuni limitate)</li>
                        <li>Lac venos</li>
                        <li>Granulom piogenic</li>
                        <li>Leziuni pigmentare superficiale precum lentiginele</li>
                    </ul>
                </Panel>
                <Panel header="Laser eCO2 lutronic" className='heading2'>
                    <p className='custom-text2'>În cazul laserului fracționat ablativ cu dioxid de carbon (CO2), mediul activ laser este un amestec de 3 gaze: dioxid de carbon 10-20%, nitrogen 10-20% si heliu. Laserul cu dioxid de carbon produce o anumită lungime de unda in spectrul infraroșu (10,600 nm).</p>
                    <br></br>
                    <p className='custom-text2'>Apa de la nivelul celulelor pielii absoarbe aceasta lungime de unda, determinând formarea de microcanale la nivelul straturilor profunde ale pielii, stimulând producerea naturala de colagen.</p>
                    <br></br>
                    <p className='custom-text2'>Primul strat al pielii (epidermul) nu este afectat în urma procedurii deoarece aparatul are integrat Dynamic Cooling Device. Acesta protejează pielea în timpul tratamentului și scade semnificativ timpul de tratament.</p>
                    <br></br>
                    <p className='custom-text2'>Afecțiunile pe care Laserul eCO2 lutronic le tratează: </p>
                    <ul className='custom-list'>
                        <li>Foto îmbătrânirea</li>
                        <li>Riduri si cute fine ale pielii</li>
                        <li>Cicatrici ( post-acnee, post-chirurgicale si arsuri)</li>
                        <li>Iregularități de textură a pielii</li>
                        <li>Leziuni pigmentare și lentigine</li>
                        <li>Rejuvenarea pielii prin stimulraea producției de colagen</li>
                    </ul>
                </Panel>
                <Panel header="Dermapen" className='heading2'>
                    <p className='custom-text2'>Dermapen este un dispozitiv inovator sub formă de stilou, ce folosește ace detașabile de unică folosință.</p>
                    <br></br>
                    <p className='custom-text2'>Funcționarea dispozitivului se bazează pe puterea de regenerare prin producerea rapidă de colagen și elastină în urma micro-leziunilor provocate de ace.</p>
                    <br></br>
                    <p className='custom-text2'>Acele penetrează pielea cu viteza și adâncime reglabilă (de la 0.0 mm până la 2.5 mm, în funcție de zona tratată și gravitatea afecțiunilor tratate). Vibrațiile de care dispune reduc considerabil senzația de durere și intensifică eficiența tratamentului, prin absorbția crescută a produselor folosite.</p>
                    <br></br>
                    <p className='custom-text2'>Primul strat al pielii (epidermul) nu este afectat în urma procedurii deoarece aparatul are integrat Dynamic Cooling Device. Acesta protejează pielea în timpul tratamentului și scade semnificativ timpul de tratament.</p>
                    <br></br>
                    <p className='custom-text2'>Afecțiunile pe care Dermapen le tratează: </p>
                    <ul className='custom-list'>
                        <li>Tonifiere, lifting si reîntinerirea pielii</li>
                        <li>Reduce cicatricile post acneice si post operatorii atrofice</li>
                        <li>Ameliorează ridurile si liniile fine</li>
                        <li>Micșorează porii dilatați</li>
                        <li>Ameliorează vergeturile</li>
                        <li>Tratează alopecia</li>
                        <li>Eliminarea celulitei</li>
                        <li>Elimină dermatita seboreică de la nivelul scalpului și a sprâncenelor</li>
                        <li>Uniformizează tenul pătat în urma expunerii la razele uva-uvb, solar</li>
                        <li>Reglează excesul de sebum</li>
                        <li>Reglează tenul atipic</li>
                    </ul>
                </Panel>
                <Panel header="OxyGeneo" className='heading2'>
                    <p className='custom-text2'>OxyGeneo este un concept unic de îngrijirea a tenului, care stimulează mecanismele naturale ale organismului, pentru o piele revitalizată și un ten echilibrat.</p>
                    <br></br>
                    <p className='custom-text2'>Tehnologia OxyGeneo declanșează procesul natural de oxigenare, ceea ce duce la o piele mai netedă și revitalizată, cu efecte vizibile după prima ședință de tratament.</p>
                    <br></br>
                    <p className='custom-text2'>OxyGeneo este recunoscut în cele mai renumite centre spa și de înfrumusețare din lume ca fiind 3-in-1 Super Facial pentru că asigură, într-un singur tratament, 3 pași esențiali de îngrijire a tenului: exfoliere, infuzie de nutrienți, stimularea procesului natural de oxigenare a pielii, prin aportul de CO2.</p>
                    <br></br>
                    <p className='custom-text2'>Puterea oxigenării naturale, completată de efectul anti-îmbătrânire al radiofrecvenței tripolare Tripollar RF, ambele îmbunătățite de puterea ultrasunetelor, oferă rezultate vizibile imediat și efecte de întinerire pe termen lung.</p>
                    <br></br>
                    <p className='custom-text2'>Kit-ul de tratament Geneo este disponibil în 3 variante: Geneo Balance Charcoal Facial pentru purificarea și echilibrarea tenului gras și îmbunătățirea texturii și aspectului acestuia, Geneo Revive Red Algae Facial pentru revitalizarea pielii terne și reducerea ridurilor fine și Geneo Illuminate Vitamina C Facial pentru uniformizarea nuanței tenului, îmbunătățirea aspectul de piele pigmentată și întinerirea tenul. OxyGeneo oferă beneficiile ingredientelor naturale, atent selecționat (cărbunele de bambus, algele roșii, vitaminele C, uleiurile de Aragan și Jojoba, vitaminele, antioxidanții și peptidele) într-un tratament cu efect puternic, dedicat tuturor tipurilor de ten și nevoilor specifice ale acestuia.</p>
                    <br></br>
                </Panel>
            </Collapse>
            <hr></hr>

        </Layout >
    );
};

export default HomePage;
