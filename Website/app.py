import os
from flask import Flask, render_template, request, send_from_directory, redirect, url_for

# 1. INIȚIALIZAREA APLICAȚIEI
# Cream o instanță a aplicației Flask. Ea va gestiona toate cererile (requests) web.
app = Flask(__name__)

# Configuram directorul de unde utilizatorii pot downloada fisierele tehnice (PDF-uri)
DOWNLOAD_FOLDER = os.path.join(app.root_path, 'downloads')


# 2. RUTA PRINCIPALĂ (HOME / INDEX)
# Cand cineva acceseaza adresa de baza a site-ului (ex: http://127.0.0.1:5000/),
# Flask va trimite fisierul HTML din folderul 'templates'.
@app.route('/')
def index():
    # render_template cauta automat in folderul 'templates' dupa index.html
    return render_template('home.html')


# 3. RUTA PENTRU COLECTAREA MESAJELOR DIN FORMULARUL DE CONTACT
# Modificam comportamentul formularului. Aceasta ruta accepta doar cereri de tip POST (trimitere de date).
@app.route('/submit-contact', methods=['POST'])
def handle_contact():
    # Extragem datele introduse de utilizator in campurile din formular
    # (Trebuie sa adaugam atributul 'name' in HTML-ul tau pentru ca asta sa functioneze perfect)
    name = request.form.get('name')
    email = request.form.get('email')
    subject = request.form.get('subject')
    message = request.form.get('message')

    # EXPLICAȚIE LOGICĂ:
    # Aici poti adauga cod pentru trimitere de mail-uri reale sau salvare intr-o baza de date.
    # Pentru moment, printam datele in consola serverului Python pentru a verifica ca functioneaza.
    print(f"\n--- MESAJ NOU PRIMIT ---")
    print(f"De la: {name} ({email})")
    print(f"Subiect: {subject}")
    print(f"Mesaj: {message}\n------------------------")

    # Dupa ce s-a trimis formularul, redirectionam utilizatorul inapoi pe pagina principala
    return redirect(url_for('index'))


# 4. RUTA PENTRU DESCĂRCAREA FIȘIERELOR TEHNICE
# <filename> actioneaza ca o variabila. Orice nume de fisier este pus in link va fi preluat de functie.
@app.route('/download/<path:filename>')
def download_file(filename):
    try:
        # send_from_directory trimite in siguranta fisierul cerut catre browserul utilizatorului
        # as_attachment=True forteaza browserul sa descarce fisierul, in loc sa il deschida in tab nou
        return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True)
    except FileNotFoundError:
        # Daca fisierul nu exista fizic in folderul 'downloads', returnam o eroare 404 text
        return "Fișierul tehnic solicitat nu a fost găsit pe server.", 404


# 5. PORNIREA SERVERULUI
# Daca rulam acest script direct (python app.py), pornim serverul de dezvoltare.
if __name__ == '__main__':
    # debug=True este extrem de util: restarteaza automat serverul cand modifici codul
    # si iti arata erorile direct in browser daca ceva nu merge bine.
    app.run(debug=True)