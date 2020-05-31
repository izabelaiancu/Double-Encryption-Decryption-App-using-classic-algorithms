document.getElementById("openFile").addEventListener("change", function () {
///preluarea fisierului IN

    var reader = new FileReader();
    reader.onload = function () {               //se citeste continutul fisierului

        var fis = this.result;
   // if (!/^[ A-Za-z]+$/.test(fis)){alert("Please insert a valid input!");}
        fis = fis.replace(/\s+/g, '');  // stergerea tuturor spatiilor din fisier; pregatire pentru criptare/descriptare Playfair
        if (/[^a-z]/i.test(fis)){fis = "Invalid Input! Please select a valid text file!";}        // validare input (detectarea non-literelor)
        document.getElementById("fileContents").textContent = fis;
        window.value = fis; //textul prelucrat al fisierului va aparea pe ecran

    }

     reader.readAsText(this.files[0]);

})

function getKey() {     //preluarea si prelucrarea cheii pentru criptarea/descriptarea Playfair
    var key = document.getElementById("key").value; //preluarea cheii introduse de catre utilizator
    if (key == "") //daca cheia este vida
    {alert("Please enter a key!");}   //alerta utilizatorului
    else if (/[^a-z]/i.test(key)){alert("Please insert a valid key!");}   //validare cheie(detectare non-litere)
    else {
        alpha = key;
        alert("You've selected the key: " + alpha); //afisarea cheii pe ecran (daca este valida)
    }
}


function setQuantity(upordown) {                //setarea shift-arii alfabetului pentru criptarea/decriptarea Caesar
    var quantity = document.getElementById('quantity'); //preluarea shift-arii
    var result;


    if (quantity.value > 0 && quantity.value < 25) {     //daca shift-area se afla in limitele alfabetului (25 litere)
        if (upordown == 'up'){++document.getElementById('quantity').value; //creste shift-area
        // result = String.fromCharCode.apply(null,[97 + quantity.value]);
        // document.getElementById('shiftness').innerHTML = "a - > " + result;
        }
        else if (upordown == 'down'){--document.getElementById('quantity').value;}}  //scadem shift-area
    else if (quantity.value == 0) {
        if (upordown == 'up'){++document.getElementById('quantity').value;}} //creste shift-area
    else
    {document.getElementById('quantity').value=0;}    //daca depasim pragurile se reseteaza contorul
    var nr = Number(65) + Number(quantity.value);      //calculam litera care va fi obtinuta in urma shiftarii(codul ASCII + shiftarea)

    result = String.fromCharCode.apply(null,[Number(nr)]);
    document.getElementById('shiftness').innerHTML = "A -> " + result;
}


function download(filename, text) { //functia de download-are a fisierului obtinut in urma actiunii; se apeleaza in functiile de criptare/decriptare
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function MakeCipherABC(abc,key1)  //functia ce va construi sirul cheie+alfabet folosit pentru construirea matricii Playfair
{
    abc=abc.toUpperCase();  //abc = alfabetul folosit pentru criptarea/decriptarea PLayfair; acesta se va calcula la apasarea butonului de download, preluand de la utilizator caracterul care va lipsi din alfabet(Q sau J)
    key1=key1.toUpperCase();
    cyabc=key1+abc; //combinam alfabetul cu cheia
    for(i=0;i<abc.length;i++)
    {
        lett = cyabc.charAt(i); //preluarea caracterelor de la un anumit index din sirul combinat
        pos=cyabc.indexOf(lett,i+1); //preluarea indexului urmatorului caracter identic (daca exista)
        while(pos>-1){   //daca am gasit un duplicat
            cyabc=cyabc.substring(0,pos)+cyabc.substring(pos+1,cyabc.length);   //il eliminam
            pos=cyabc.indexOf(lett,i+1); //cautam alt duplicat
        }
    }
    return cyabc; //returnam sirul prelucrat(ce reprezinta matricea dupa care vom lucra pentru Playfair)
}


function DoPlayfair(et,abc,key1,dir,dup)  //functia de criptare/decriptare Playfair
//et = textul de prelucrat
//abc = alfabetul
//key1 = cheia introdusa de utilizator
//dir = "E"(pentru criptare) sau "D"(pentru decriptare)
//dup = litera care va fi eliminata din alfabet (Q sau J)
{

    et=et.toUpperCase();   //transformam toate char-urile in majuscule
    abc=abc.toUpperCase();
    key1=key1.toUpperCase();
    // pos=et.indexOf(" ");
    // while(pos>-1){      //eliminare eventuale spatii(daca va fi nevoie)
    //     et=et.substring(0,pos)+et.substring(pos+1,et.length);
    //     pos=et.indexOf(" ");
    // }

    // pos=et.indexOf("?");
    // while(pos>-1){
    //     et=et.substring(0,pos)+et.substring(pos+1,et.length);
    //     pos=et.indexOf("?");
    // }

    for(i=0;i<et.length;i=i+2)   //textul de input va fi prelucrat cate 2 caractere deodata, deci in cazul in care am avea un numar impar de litere vom plasa un 'X' la finalul textului
        //de asemenea, in cazul literelor duplicate una dupa alta, acestea se vor separa cu un 'X'
    {let1=et.charAt(i);
        let2=et.charAt(i+1);
        if(let1==let2){
            et=et.substring(0,i+1)+"X"+et.substring(i+1,et.length);
        }
    }
    if( (et.length%2)==1 ){et+='X'}

    if(dup!=""){               //eliminam caracterul dup(J sau Q) si il inlocuim cu 'I'
        pos=et.indexOf(dup);
        while(pos>-1){
            et=et.substring(0,pos)+"I"+et.substring(pos+1,et.length);
            pos=et.indexOf(dup);
        }
    }

    cyabc=MakeCipherABC(abc,key1);   //formarea sirului pentru criptare/decriptare
    row=new Array(); //declararea matricii
    for(i=0;i<5;i++){
        row[i]="";
    }
    for(i=0;i<5;i++){
        for(j=0;j<5;j++)row[i]+=cyabc.charAt(5*i+j);  //asezarea caracterelor din sirul cyabc in cate o celula din matrice
    }

    shf=1;
    if(dir=="E") {        //daca criptam ne vom misca cu o casuta
        shf=1;}
    if(dir=="D"){   //daca decriptam va trebui sa ne miscam invers criptarii
        shf=4};

    dt=""; //declararea rezultatului
    for(i=0;i<et.length;i=i+2)
    {
        pos1=cyabc.indexOf(et.charAt(i));  //prelucarea caracterelor 2 cate 2 si gasirea pozitiilor lor in matricea Playfair
        pos2=cyabc.indexOf(et.charAt(i+1));
        x1=pos1%5;
        y1=Math.floor(pos1/5);
        x2=pos2%5;
        y2=Math.floor(pos2/5);

        if(y1==y2){  //cazul 1: daca caracterele se afla pe aceeasi coloana
            x1=(x1+shf)%5; //alegem caracterele din dreapta lor
            x2=(x2+shf)%5}
        else if(x1==x2) //cazul 2: daca caracterele se afla pe aceeasi linie
        {y1=(y1+shf)%5; //alegem caracterele de sub ele
            y2=(y2+shf)%5}
        else{temp=x1;  //schimbam cu colturile
            x1=x2;
            x2=temp
        };

        dt+=row[y1].charAt(x1)+row[y2].charAt(x2) ;  //adaugam caracterele obtinute la sirul final
    };


    return dt;
};



function DoCaeserEncrypt(x,shf) //functia pentru criptarea caesar
//x = sirul de input
//shf = shift-ul alfabetului introdus de catre utilizator
{
    abc="abcdefghijklmnopqrstuvwxyz";
    ABC="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    r1="";r2="";shf=eval(shf);
    for(i=0;i<x.length;i++){lett=x.charAt(i);pos=ABC.indexOf(lett);if(pos>=0){r1+=ABC.charAt(  (pos+shf)%26  )}else{r1+=lett};};
    return r1;
};

function DoCaeserDecrypt(x,shf)
{return DoCaeserEncrypt(x,26-shf);};

// Start  download-area fisierului prelucrat
document.getElementById("download-btn").addEventListener("click", function(){

    var choice = document.getElementById("select").value; //preluarea actiunii : criptare sau decriptare
    //var input = document.getElementById()
    var input = window.value; //preluarea textlui prelucrat din fisierul de input
    if (input ==""){alert("Please select a valid input file!");}  //daca fisierul este vid, alertam utilizatorul
    else{
   // var abc = ":";
    var key = document.getElementById("key").value;  //preluarea cheii introduse de catre utilizator
    if (key == ""){alert("Please enter a key!");}  //daca cheia este vida, alertam utilizatorul
    else{
    var dup = document.getElementById("dup").value;         //preluarea literei ce va fi inlocuita cu 'I'
    var shift = document.getElementById("quantity").value; //preluarea shift-arii introduse de catre utilizator

    if (dup == "Q")
    {var abc = "ABCDEFGHIJKLMNOPRSTUVWXYZ";}   //formarea alfabetului folosit pentru Playfair in urma alegerii utilizatorului
   if(dup == "J")
    {var abc = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';}
    var filename = "output.txt";


    if(choice == "decriptare"){       //in cazul decriptarii mai intai decriptam cu Caesar si apoi Playfair
        var text = DoCaeserDecrypt(input,shift);

        var text2 =  DoPlayfair(text,abc,key,'D', dup);

    }

    else {
        var text =  DoPlayfair(input,abc,key,'E', dup);   //la cripare invers

        var text2 = DoCaeserEncrypt(text,shift);
    }

    download(filename,text2); //afisare optiune de download a fisierului obtinut
}}}, false);


document.getElementById("e").addEventListener("click", function () {

    alert("You chose to encrypt the text file."); //alerte la apasarea butonului de Criptare

})

document.getElementById("d").addEventListener("click", function () {

    alert("You chose to decrypt the text file.");  //alerte la apasarea butonului de Decriptare

})



