<?php
  $name = $_POST["name"];
  $email = $_POST["email"];
  $message = $_POST["message"];
  $subject =$_POST["subject"];
  

  $mailtext = '<html>
   
  <body>
   
  <h1>Ihre Nachricht an das Team von RemedyMatch</h1>
   
  <p> Diese Nachricht ist eine Kopie ihrer Nachricht an uns:</p>
  
  '.$message.'
   
  <p>Diese E-Mail wurde automatisch erstellt, bitte antworten Sie nicht auf diese Email</p>
   
  </body>
  </html>';

   //Mailadresse
  $absender   = "noreply@remedymatch.io";
  $betreff    = "Ihre Nachricht an das Team von RemedyMatch:" .$subject;
  $betreff = "=?utf-8?b?".base64_encode($betreff)."?=";
   
  $header  = "MIME-Version: 1.0\r\n";
  $header .= "Content-type: text/html; charset=utf-8\r\n";
   
  $header .= "From: $absender\r\n";

  $header .= "Cc: contact@remedymatch.io\r\n";  
  
   
  mail( $email,
        $betreff,
        $mailtext,
        $header);
  echo '<script type="text/javascript">';
  echo 'alert("Email erfolgreich versendet!")'; //Use here the react call from PHP if necessary 
  echo '</script>';

?>



<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <link
      href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900"
      rel="stylesheet"
    />

    <title>Helft zu helfen!</title>
<!--
Reflux Template
https://templatemo.com/tm-531-reflux
-->
    <!-- Bootstrap core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />

    <!-- Additional CSS Files -->
    <link rel="stylesheet" href="assets/css/fontawesome.css" />
    <link rel="stylesheet" href="assets/css/templatemo-style.css" />
    <link rel="stylesheet" href="assets/css/owl.css" />
    <link rel="stylesheet" href="assets/css/lightbox.css" />
    
    <link rel="shortcut icon" href="favicon.ico">
    <link rel="icon" type="image/png" href="favicon.png" sizes="32x32">
    <link rel="icon" type="image/png" href="favicon.png" sizes="96x96">
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="mstile-144x144.png">
  </head>

  <body>
    <div id="page-wraper">
      <!-- Sidebar Menu -->
      <div class="responsive-nav">
        <i class="fa fa-bars" id="menu-toggle"></i>
        <div id="menu" class="menu">
          <i class="fa fa-times" id="menu-close"></i>
          <div class="container">
            <div class="image">
              <a href="#"><img src="assets/images/logo.png" alt="" /></a>
            </div>
            <div class="author-content">
              <h4>RemedyMatch</h4>
              <span>Hilft beim helfen</span>
            </div>
            <nav class="main-nav" role="navigation">
              <ul class="main-menu">
                <li><a href="#section1">Über uns</a></li>
                <li><a href="#section2">Helfen/ Um Hilfe bitten</a></li>
                <li><a href="#section3">Informationen</a></li>
                <li><a href="#section4">Kontakt</a></li>
              </ul>
            </nav>
            <div class="social-network">
              <ul class="soial-icons">
                <li>
                  <a href="https://www.facebook.com/remedy.match.16" target="_blank"><i class="fa fa-facebook"></i
                  ></a>
                </li>
                <li>
                  <a href="https://twitter.com/RemedyMatch" target="_blank"><i class="fa fa-twitter"></i></a>
                </li>
                <li>
                  <a href="https://www.instagram.com/remedymatch/" target="_blank"><i class="fa fa-instagram"></i></a>
                </li>
                <li>
                  <a href="https://github.com/remedyMatch" target="_blank"><i class="fa fa-github"></i></a>
                </li>
              </ul>
            </div>
            <div class="copyright-text">
              <p>Copyright 2020 RemedyMatch</p>
            </div>
          </div>
        </div>
      </div>

      <section class="section about-us" data-section="section1">
        <div class="container">
          <div class="section-heading">
            <h2>Über uns</h2>
            <div class="line-dec"></div>
            <span>
              REMEDYMATCH ist ein System zur Schaffung einer bundesweiten Bestands- und Bedarfsübersicht von medizinischen Schutzartikeln für Institutionen im Kampf gegen COVID-19.</br>

             
            </span>
            
          </div>
          <div class="left-image-post">
            <div class="row">
              <div class="col-md-6">
                <div class="left-image">
                  <img src="assets/images/Werbung1.png" alt="" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="right-text">
                  <h4>Wie es funktioniert</h4>
                  <p>
                      Bedarfserbringer pflegen den Bestand lagernder Schutzartikel in die Plattform ein. Bedarfsträger (Krankenhäuser, Ärzte, Pflegedienste, , weitere Institutionen) können über 
                      REMEDYMATCH innerhalb kürzester Zeit einen aktuellen Überblick über verfügbare medizinische Schutzausrüstung erhalten und den Kontakt zu dem/den Bedarfserbringer/n aufnehmen, 
                      welche Ressourcen zur Verfügung stellen können um die Lieferengpässe dieser Artikel zu überbrücken. </br>

                      Schutzartikel, welche dem medizinischen Einsatz nicht gerecht werden, können an besonders gefährdete Institutionen/Personengruppen (Apotheker, Tankstellen, Bankangestellte, 
                      Lebensmittelversorgung, usw.) verteilt werden um deren Schutz zu gewährleisten. Durch die Bevölkerung/Unternehmen gespendete Artikel.</br>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      <section class="section my-services" data-section="section2">
        <div class="container">
          <div class="section-heading">
            <h2>Um Hilfe bitten</h2>
            <div class="line-dec"></div>
            <span
              >Suchen Sie hier aus, ob Sie Material bieten können oder ob Sie noch Material suchen.</span
            >
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="service-item">
                <div class="first-service-icon service-icon"></div>
                <h4>Hilfe anbieten</h4>
                <p>
                  Haben Sie Atemschutzmasken, Handschuhe oder sonstiges Material, welches Sie abgeben wollen, dann klicken Sie hier
                  <div class="white-button-service">
                    <a href="#">Hilfe anbieten</a>
                  </div>
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="service-item">
                <div class="first-service-icon service-icon"></div>
                <h4>Hilfe anfragen</h4>
                <p>
                  Benötigen Sie noch medizinsches Material, Handschuhe oder Mundschutz, dann klicken Sie hier.
                  <div class="white-button-service">
                    <a href="#">Hilfsangebote finden</a>
                  </div>
                </p>
              </div>
            </div>
           
            
          </div>
        </div>
      </section>

      <section class="section my-work" data-section="section3">
        <div class="container">
          <div class="section-heading">
            <h2>Informationen</h2>
            <div class="line-dec"></div>
            
          </div>
          <div class="row">
            <div class="isotope-wrapper">
                <div class="isotope-box">
                <div class="isotope-item" data-type="people">
                  <figure class="snip1321">
                    <img
                      src="assets/images/virus.png"
                      alt="sq-sample26"
                    />
                    <figcaption>
                      <a
                        href="assets/images/virus.png"
                        data-lightbox="image-1"
                        data-title="Der SARS-CoV-2 Virus"
                        ><i class="fa fa-search"></i
                      ></a>
                      <h4>Der SARS-CoV-2 Virus</h4>
                      <span>Der Der SARS-CoV-2 Virus kann die gefährliche Krankheit Covid19 auslösen.</span>
                    </figcaption>
                  </figure>
                </div>

               
                <div class="isotope-item" data-type="nature">
                  <figure class="snip1321">
                    <img
                      src="assets/images/mask.jpg"
                      alt="sq-sample26"
                    />
                    <figcaption>
                      <a
                        href="assets/images/mask.jpg"
                        data-lightbox="image-1"
                        data-title="Atemschutzmasken der Schutzklasse FFP-2"
                        ><i class="fa fa-search"></i
                      ></a>
                      <h4>Atemschutzmasken der Schutzklasse FFP-2</h4>
                      <span>Diese Schutzmaske, soll laut dem RKI, die Pflegedienstmitarbeiter vor einer Infektion mit dem SARS-CoV-2 schützen.</span>
                    </figcaption>
                  </figure>
                </div>
                 <div class="isotope-item" data-type="animals">
                  <figure class="snip1321">
                    <img
                      src="assets/images/fallzahlen.jpg"
                      alt="sq-sample26"
                    />
                    <figcaption>
                      <a
                        href="https://de.wikipedia.org/api/rest_v1/page/graph/png/COVID-19-Pandemie_in_Deutschland/0/32a77a02aaed45b971880edbb418ac3fdeb27525.png"
                        data-lightbox="image-1"
                        data-title="Fallzahlen ind Deutschland"
                        ><i class="fa fa-search"></i
                      ></a>
                      <h4>Fallzahlen in Deutschland</h4>
                      <span>Klicken Sie hier um einen Überblick über die aktuellen Fallzahlen in Deutschland zu erhalten.</span>
                    </figcaption>
                  </figure>
                </div>
                

                <div class="isotope-item" data-type="people">
                  <figure class="snip1321">
                    <img
                      src="assets/images/einmalhandschuhe.jpg"
                      alt="sq-sample26"
                    />
                    <figcaption>
                      <a
                        href="assets/images/einmalhandschuhe.jpg"
                        data-lightbox="image-1"
                        data-title="Caption"
                        ><i class="fa fa-search"></i
                      ></a>
                      <h4>Einmalhandschuhe</h4>
                      <span>Diese Handschuhe sollen das Personal vor einer Corona-Infektion schützen, werden aber langsam knapp.</span>
                    </figcaption>
                  </figure>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section contact-us" data-section="section4">
        <div class="container">
          <div class="section-heading">
            <h2>Kontaktieren Sie uns:</h2>
            <div class="line-dec"></div>
            <span
              >Bei Fragen und Problemen rund um den Ablauf und die Erstellung von Angeboten oder Anfragen, schreiben Sie uns einfach über das untenstehende Formular eine Nachricht. 
              Wir werden uns dann schnellst möglich um Ihr Anliegen kümmern. Bitte sehen Sie davon ab uns eine Nachricht zu senden, damit wir Ihnen ein Gesuch oder Angebot erzeugen, hierfür haben wir nicht die nötigen Ressourcen, herzlichen Dank.</span
            >
          </div>
          <div class="row">
            <div class="right-content">
              <div class="container">
                <form id="contact" action="index.php" method="post">
                  <div class="row">
                    <div class="col-md-6">
                      <fieldset>
                        <input
                          name="name"
                          type="text"
                          class="form-control"
                          id="name"
                          placeholder="Ihr Name..."
                          required=""
                        />
                      </fieldset>
                    </div>
                    <div class="col-md-6">
                      <fieldset>
                        <input
                          name="email"
                          type="text"
                          class="form-control"
                          id="email"
                          placeholder="Ihre Email..."
                          required=""
                        />
                      </fieldset>
                    </div>
                    <div class="col-md-12">
                      <fieldset>
                        <input
                          name="subject"
                          type="text"
                          class="form-control"
                          id="subject"
                          placeholder="Betreff ihrer Anfrage..."
                          required=""
                        />
                      </fieldset>
                    </div>
                    <div class="col-md-12">
                      <fieldset>
                        <textarea
                          name="message"
                          rows="6"
                          class="form-control"
                          id="message"
                          placeholder="Ihre Nachricht..."
                          required=""
                        ></textarea>
                      </fieldset>
                    </div>
                    <div class="col-md-12">
                      <fieldset>
                        <button type="submit" id="form-submit" class="button">
                          Nachricht senden
                        </button>
                      </fieldset>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Scripts -->
    <!-- Bootstrap core JavaScript -->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <script src="assets/js/isotope.min.js"></script>
    <script src="assets/js/owl-carousel.js"></script>
    <script src="assets/js/lightbox.js"></script>
    <script src="assets/js/custom.js"></script>
    <script>
      //according to loftblog tut
      $(".main-menu li:first").addClass("active");

      var showSection = function showSection(section, isAnimate) {
        var direction = section.replace(/#/, ""),
          reqSection = $(".section").filter(
            '[data-section="' + direction + '"]'
          ),
          reqSectionPos = reqSection.offset().top - 0;

        if (isAnimate) {
          $("body, html").animate(
            {
              scrollTop: reqSectionPos
            },
            800
          );
        } else {
          $("body, html").scrollTop(reqSectionPos);
        }
      };

      var checkSection = function checkSection() {
        $(".section").each(function() {
          var $this = $(this),
            topEdge = $this.offset().top - 80,
            bottomEdge = topEdge + $this.height(),
            wScroll = $(window).scrollTop();
          if (topEdge < wScroll && bottomEdge > wScroll) {
            var currentId = $this.data("section"),
              reqLink = $("a").filter("[href*=\\#" + currentId + "]");
            reqLink
              .closest("li")
              .addClass("active")
              .siblings()
              .removeClass("active");
          }
        });
      };

      $(".main-menu").on("click", "a", function(e) {
        e.preventDefault();
        showSection($(this).attr("href"), true);
      });

      $(window).scroll(function() {
        checkSection();
      });
    </script>
  </body>
</html>
