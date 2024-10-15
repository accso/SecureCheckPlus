
const language = {
    de: {
        breadCrumbMap: {
            projects: "Projektübersicht",
            dependencies: "Komponenten",
            contact: "Kontakt",
            privacy: "Datenschutz"
        },
        pageTitles: {
            error: "Error 404",
            login: "Login",
            projects: "Alle Projekte",
            favorite: "Favoriten",
            recent: "Kürzlich",
        },
        loginPage: {
            userLabel: "E-Mail-Adresse",
            passwordLabel: "Passwort",
            buttonLabel: "Anmelden",
            title: "Sichere dein Projekt",
            login: "Anmelden",
            checkBoxLabel: "Angemeldet bleiben"
        },
        misc: {
            severity: {
                CRITICAL: "Critical",
                HIGH: "High",
                MEDIUM: "Medium",
                LOW: "Low",
                NONE: "None",
                NA: "N/A"
            },
            deploymentThreshold: {
                ALWAYS: "Immer deployen",
                CRITICAL: "Critical",
                HIGH: "High",
                MEDIUM: "Medium",
                LOW: "Low",
                NONE: "None",
                NEVER: "Niemals deployen"
            },
            notificationThreshold: {
                ALWAYS: "Nie benachrichtigen", //Immer ignorieren
                CRITICAL: "Critical",
                HIGH: "High",
                MEDIUM: "Medium",
                LOW: "Low",
                NONE: "None",
                NEVER: "Immer benachrichtigen" //Niemals ignorieren
            },
            status: {
                REVIEW: "Zu bewerten",
                REVIEW_AGAIN: "Erneut zu bewerten",
                THREAT: "Bedrohung",
                THREAT_WIP: "Bedrohung - In Bearbeitung",
                THREAT_FIXED: "Bedrohung - Behoben",
                NO_THREAT: "Keine Bedrohung",
                REMOVED: "Entfernt"
            },
            solution: {
                NO_SOLUTION_NEEDED: "Keine Aktion erforderlich",
                CHANGE_VERSION: "Versionswechsel",
                CHANGE_DEPENDENCY: "Dependency wechseln",
                PROGRAMMING: "Programmierung",
                NO_SOLUTION: "Keine Lösung vorhanden"
            },
            noProjectsFound: "Keine Ergebnisse gefunden!",
            cancel: "Abbrechen",
            save: "Speichern",
            confirm: "Bestätigen",
            back: "Zurück",
            loading: "Lädt..."
        },
        ProjectOverviewPage: {
            toolTips: {
                projectCount: "Projekte",
            },
        },
        ProjectPage: {
            updatedTitle: "Aktualisiert am",
            dependenciesTitle: "Dependencies",
            resolvedReportsTitle: "Erledigt",
            notEvaluatedTitle: "Unbewertet",
            evaluatedTitle: "Bewertet",
            statusRatio: "Status Verhältnis",
            deploymentThresholdTitle: "Deployment Threshold",
            apiKeyButtonText: "API-Key generieren",
        },
        DependenciesPage:{
            packages: "Bibliotheken",
            active: "Aktiv",
            description: "Bibliothek befindet sich im aktuellen Build",
            version: "Version",
            packageManager: "Package Manager",
            license: "Lizenz",
            path: "Pfad",
        },
        ReportPage: {
            statusHeader: "Status",
            severityHeader: "Schweregrad",
            dependencyHeader: "Dependency",
            descriptionHeader: "Beschreibung",
            open: "Öffnen",
            all: "Alle",
            toolTips: {
                overallCvss: "Der berechnete CVSS-Score ist eine manuelle Verfeinerung des Base-Scores und kann durch den Nutzer über den eingebauten CVSS-Rechner angepasst werden.",
                epss: "Wahrscheinlichkeit, dass die Schwachstelle in den nächsten 30 Tagen ausgenutzt wird.",
            },
        },
        ReportDetailPage: {
            additionalLinksTitle: "Weitere Infos",
            statusTitle: "Status",
            commentTitle: "Anmerkungen",
            commentPlaceholder: "Kommentieren...",
            infosFound:{
                infosFoundTitle: "Folgende Informationen gefunden...",
                detailedDescription: "Detaillierte Beschreibung:",
                suggestedSolutions: "Vorgeschlagene Lösungen",
                mendIo: "Mend.io:",
                aquaSec: "AquaSec:",
            },
            lastUpdate: "Letztes Update: ",
            author: "Von",
            noAuthor: "Kein Autor",
            published: "Veröffentlicht: ",
            vulnerabilityVector: {
                attackVector: "Attack Vector",
                attackComplexity: "Attack Complexity",
                privilegesRequired: "Privileges Required",
                scope: "Scope",
                confidentialityImpact: "Confidentiality Impact",
                integrityImpact: "Integrity Impact",
                availabilityImpact: "Availability Impact",
                userInteraction: "User Interaction"
            },
            vulnerabilityDomain: {
                NETWORK: "Network",
                ADJACENT: "Adjacent",
                LOCAL: "Local",
                PHYSICAL: "Physical",
                NONE: "None",
                LOW: "Low",
                HIGH: "High",
                REQUIRED: "Required",
                CHANGED: "Changed",
                UNCHANGED: "Unchanged"
            },
            toolTips: {
                epss: "Wahrscheinlichkeit eines Angriffs in den nächsten 30 Tagen",
                waiverConfig: "Waiver Konfiguration",
            },
            cvssVectorString: "CVSS 3.1 Vektor String",
            cvssVectorStringNoChanges: "Es wurden keine Änderungen im CVSS Rechner vorgenommen.",
            waiverButton: "CVSS Rechner",
            waiverConfig: {
                main: {
                    title: "Waiver Konfiguration",
                    scoreMetricCategories: {
                        temporalScoreMetrics: "Temporal Score Metrics",
                        esmRequirements: "Environmental Score Metrics - Requirements",
                        esmModifier: "Environmental Score Metrics - Modifier",
                    },
                    hint:{
                        buttonText: "REPORT WERT",
                        buttonDescr: "Ursprüngliche Werte sind so hervorgehoben:",
                        commentBox: "Kommentieren...",
                        commentBox2: "Kommentar",
                    },
                    scoreMetrics: {
                        exploitCodeMaturity: "Exploit Code Maturity",
                        remediationLevel: "Remediation Level",
                        reportConfidence: "Report Confidence",
                        modifiedAttackVector: "Modified Attack Vector",
                        modifiedAttackComplexity: "Modified Attack Complexity",
                        modifiedPrivilegesRequired: "Modified Privileges Required",
                        modifiedUserInteraction: "Modified User Interaction",
                        modifiedScope: "Modified Scope",
                        modifiedConfidentiality: "Modified Confidentiality",
                        modifiedIntegrity: "Modified Integrity",
                        modifiedAvailability: "Modified Availability",
                        confidentialityRequirement: "Confidentiality Requirement",
                        integrityRequirement: "Integrity Requirement",
                        availabilityRequirement: "Availability Requirement",
                    },
                    scoreMetricValues: {
                        notDefined: "Not Defined",
                        unproven: "Unproven",
                        proofOfConcept: "Proof-of-Concept",
                        functional: "Functional",
                        high: "High",
                        officialFix: "Official fix",
                        temporaryFix: "Temporary fix",
                        workaround: "Workaround",
                        unavailable: "Unavailable",
                        unknown: "Unknown",
                        reasonable: "Reasonable",
                        confirmed: "Confirmed",
                        network: "Network",
                        adjacent: "Adjacent",
                        local: "Local",
                        physical: "Physical",
                        low: "Low",
                        medium: "Medium",
                        none: "None",
                        required: "Required",
                        unchanged: "Unchanged",
                        changed: "Changed",
                    },
                },
                sidebar:{
                    project:{
                        projectGroup: "Projekt Gruppe",
                        projectId: "Projekt ID",
                        lastEdited: "Letzte Änderung",
                        author: "Von",
                    },
                    scope:{
                        scope: "Scope",
                        ignoreFinding: "Ignore finding",
                        always: "Always",
                        datePickerLabel: "Expire date",
                        datePickerHintInfo: "Date required",
                        datePickerHintError: "Invalid date!",
                    },
                    score:{
                        baseScore: "CVSS Base Score",
                        impact: "Impact Subscore",
                        exploitability: "Exploitability Subscore",
                        temporalScore: "CVSS Temporal Score",
                        environmental: "CVSS Environmental Score",
                        modifiedImpact: "Modified Impact Subscore",
                        overall: "Overall CVSS Score",
                    },
                    save: "Speichern",
                },
            },
        },
        navbar: {
            searchbarPlaceholder: "Projekte suchen...",
            profileIconTooltip: "Benutzer Einstellungen",
            settings: "Einstellungen",
            logout: "Ausloggen"
        },
        sidebar: {
            upperMenu: {
                projects: "Projekte",
                projectGroups: "Projekt Gruppen",
                privacy: "Datenschutz",
                contact: "Kontakt"
            },
            lowerMenu: {
                github: "GitHub"
            }
        },
        notificationMessage: {
            noProjectsFound: "Keine Projekte gefunden...",
            usernameIsNotMail: "Der gegebene Nutzername muss eine E-Mail Adresse sein.",
            incorrectLogin: "Login fehlgeschlagen.",
            errorDataFetch: "Fehler beim Laden der Daten!",
            errorPageTitle: "Ups, da ist wohl ein Fehler passiert.",
            errorPageSubtitle: "Die Seite nach der du suchst konnte nicht gefunden werden.",
            errorUserDataFetch: "Nutzerdaten konnten nicht vom Server geladen werden!",
            saveSuccessfully: "Erfolgreich gespeichert!",
            settingsSaveFailed: "Fehler beim Speichern der Einstellungen!",
            invalidExpireDate: "Ungültiges Ablaufdatum.",
            updateReportFailed: "Fehler beim Speichern des Reports!",
            missingPermission: "Fehlende Berechtigung!",
            projectCreationFailed: "Das Projekt konnte nicht erstellt werden.",
            apiKeyCreationWarning: "Achtung der API-Key kann nicht rekonstruiert werden, sobald du die Seite verlässt.",
            saveToClipboardSuccess: "Erfolgreich in die Zwischenablage kopiert.",
            updateSuccessful: "Update erfolgreich!",
            updateFailed: "Update fehlgeschlagen!",
        },
        filterBox: {
            selectAll: "Alle auswählen",
            filter: "Filter"
        },
        dialog: {
            create: "Erstellen...",
            delete: "Löschen...",
            areYouSure: "Sind sie sicher?",
            projectId: "Projekt ID",
            projectIdHelperNotEmpty: "Projekt ID darf nicht leer sein.",
            projectIdHelperNoSpaces: "Projekt ID darf keine Leerzeichen beinhalten.",
            projectIdHelperToLong: "Projekt ID ist länger als 20 Zeichen lang.",
            projectIdHelperIdAlreadyUsed: "Projekt ID bereits vergeben.",
            projectName: "Projektname",
            projectNameHelperToLong: "Projektname zu lang.",
            projectSettingTitle: "Projekteinstellungen",
            imageHash: "Bildname",
            notificationThreshold: "Benachrichtigungsstufe",
            userSettingsTitle: "Nutzereinstellungen",
            createProject: "Projekt erstellen",
            deleteProject: "Projekt löschen",
            deleteProjects: "Projekte löschen",
            cookieDialog: {
                cookieTitle: "Cookies",
                cookieContentText: "SecureCheckPlus by Accso verwendet Cookies, um dir einen besseren, sichereren und schnelleren Dienst zu bieten. " +
                    "Einige Cookies sind notwendig, um die Dienste nutzen zu können, die SecureCheckPlus by Accso bereitstellt. " +
                    "SecureCheckPlus by Accso sammelt dabei nur notwendige Daten, die für die ordnungsgemäße Funktion der Anwendung benötigt werden. " +
                    "Welche Daten genau gesammelt werden kannst du in der Datenschutzerklärung nach lesen. " +
                    "Beim betätigen des [Akzeptieren] Knopfes erlaubst du uns, diese Daten zu sammeln und Cookies zu verwenden.",
                acceptCookies: "Akzeptieren",
                denyCookies: "Ablehnen"
            }

        },
        toolTips: {
            vendorLink: "Herstellerinformationen",
            notAvailable: "Nicht verfügbar!",
            missingPermission: "Fehlende Berechtigung zum Bearbeiten!",
            overwritingAPIKey: "Achtung! Bei erneuter Generierung wird der alte API-Key gelöscht.",
        }
    },
    en: {
        breadCrumbMap: {
            projects: "Project overview",
            dependencies: "Components",
            contact: "Contact",
            privacy: "Data Privacy"
        },
        pageTitles: {
            error: "Error 404",
            login: "Login",
            projects: "All projects",
            favorite: "Favorites",
            recent: "Recent",
        },
        loginPage: {
            userLabel: "EMail Address",
            passwordLabel: "Password",
            buttonLabel: "Log in",
            title: "Secure Your Project",
            login: "Login",
            checkBoxLabel: "Keep me logged in"
        },
        misc: {
            severity: {
                CRITICAL: "Critical",
                HIGH: "High",
                MEDIUM: "Medium",
                LOW: "Low",
                NONE: "None",
                NA: "N/A"
            },
            deploymentThreshold: {
                ALWAYS: "Always deploy",
                CRITICAL: "Critical",
                HIGH: "High",
                MEDIUM: "Medium",
                LOW: "Low",
                NONE: "None",
                NEVER: "Never deploy"
            },
            notificationThreshold: {
                ALWAYS: "Never notify", // Always ignore
                CRITICAL: "Critical",
                HIGH: "High",
                MEDIUM: "Medium",
                LOW: "Low",
                NONE: "None",
                NEVER: "Always notify" // Never ignore
            },
            status: {
                REVIEW: "Review",
                REVIEW_AGAIN: "Review again",
                THREAT: "Threat",
                THREAT_WIP: "Threat - in progress",
                THREAT_FIXED: "Threat - Fixed",
                NO_THREAT: "No Threat",
                REMOVED: "Removed"
            },
            solution: {
                NO_SOLUTION_NEEDED: "No solution needed",
                CHANGE_VERSION: "Change version",
                CHANGE_DEPENDENCY: "Change dependency",
                PROGRAMMING: "Programming",
                NO_SOLUTION: "No solution available"
            },
            noProjectsFound: "No results found!",
            cancel: "Cancel",
            save: "Save",
            confirm: "Confirm",
            back: "Back",
            loading: "Loading..."
        },
        ProjectOverviewPage: {
            toolTips: {
                projectCount: "Projects",
            },
        },
        ProjectPage: {
            updatedTitle: "Updated on",
            dependenciesTitle: "Dependencies",
            resolvedReportsTitle: "Resolved",
            notEvaluatedTitle: "Unevaluated",
            evaluatedTitle: "Evaluated",
            statusRatio: "Status ratio",
            deploymentThresholdTitle: "Deployment threshold",
            apiKeyButtonText: "generate API-Key",
        },
        DependenciesPage:{
            packages: "Packages",
            active: "Active",
            description: "Library is in current build",
            version: "Version",
            packageManager: "Package Manager",
            license: "License",
            path: "Path",
        },
        ReportPage: {
            statusHeader: "Status",
            severityHeader: "Severity",
            dependencyHeader: "Dependency",
            descriptionHeader: "Description",
            open: "Open",
            all: "All",
            toolTips: {
                overallCvss: "The calculated CVSS score is a manual refinement of the Base Score and can be adjusted by the user using the built-in CVSS calculator.",
                epss: "Probability of the vulnerability being exploited in the next 30 days.",
            },
        },
        ReportDetailPage: {
            additionalLinksTitle: "More info",
            statusTitle: "Status",
            commentTitle: "Comments",
            commentPlaceholder: "Comment...",
            infosFound:{
                infosFoundTitle: "Found information...",
                detailedDescription: "Detailed description:",
                suggestedSolutions: "Suggested solutions",
                mendIo: "Mend.io:",
                aquaSec: "AquaSec:",
            },
            lastUpdate: "Last update: ",
            author: "From: ",
            noAuthor: "No author",
            published: "Published: ",
            vulnerabilityVector: {
                attackVector: "Attack Vector",
                attackComplexity: "Attack Complexity",
                privilegesRequired: "Privileges Required",
                scope: "Scope",
                confidentialityImpact: "Confidentiality Impact",
                integrityImpact: "Integrity Impact",
                availabilityImpact: "Availability Impact",
                userInteraction: "User Interaction"
            },
            vulnerabilityDomain: {
                NETWORK: "Network",
                ADJACENT: "Adjacent",
                LOCAL: "Local",
                PHYSICAL: "Physical",
                NONE: "None",
                LOW: "Low",
                HIGH: "High",
                REQUIRED: "Required",
                CHANGED: "Changed",
                UNCHANGED: "Unchanged"
            },
            toolTips: {
                epss: "Probability of an attack in the next 30 days.",
                waiverConfig: "Waiver configuration",
            },
            cvssVectorString: "CVSS 3.1 Vector String",
            cvssVectorStringNoChanges: "No changes were made in the CVSS calculator.",
            waiverButton: "CVSS Calculator",
            waiverConfig: {
                main: {
                    title: "Waiver configuration",
                    scoreMetricCategories: {
                        temporalScoreMetrics: "Temporal Score Metrics",
                        esmRequirements: "Environmental Score Metrics - Requirements",
                        esmModifier: "Environmental Score Metrics - Modifier",
                    },
                    hint:{
                        buttonText: "REPORT VALUE",
                        buttonDescr: "Initial values are highlighted",
                        commentBox: "Comment...",
                        commentBox2: "Comment"
                    },
                    scoreMetrics: {
                        exploitCodeMaturity: "Exploit Code Maturity",
                        remediationLevel: "Remediation Level",
                        reportConfidence: "Report Confidence",
                        modifiedAttackVector: "Modified Attack Vector",
                        modifiedAttackComplexity: "Modified Attack Complexity",
                        modifiedPrivilegesRequired: "Modified Privileges Required",
                        modifiedUserInteraction: "Modified User Interaction",
                        modifiedScope: "Modified Scope",
                        modifiedConfidentiality: "Modified Confidentiality",
                        modifiedIntegrity: "Modified Integrity",
                        modifiedAvailability: "Modified Availability",
                        confidentialityRequirement: "Confidentiality Requirement",
                        integrityRequirement: "Integrity Requirement",
                        availabilityRequirement: "Availability Requirement",
                    },
                    scoreMetricValues: {
                        notDefined: "Not Defined",
                        unproven: "Unproven",
                        proofOfConcept: "Proof-of-Concept",
                        functional: "Functional",
                        high: "High",
                        officialFix: "Official fix",
                        temporaryFix: "Temporary fix",
                        workaround: "Workaround",
                        unavailable: "Unavailable",
                        unknown: "Unknown",
                        reasonable: "Reasonable",
                        confirmed: "Confirmed",
                        network: "Network",
                        adjacent: "Adjacent",
                        local: "Local",
                        physical: "Physical",
                        low: "Low",
                        medium: "Medium",
                        none: "None",
                        required: "Required",
                        unchanged: "Unchanged",
                        changed: "Changed",
                    },
                },
                sidebar:{
                    project:{
                        projectGroup: "Project Group:",
                        projectId: "Project ID:",
                        lastEdited: "Last edited:",
                        author: "From:",
                    },
                    scope:{
                        scope: "Scope",
                        ignoreFinding: "Ignore finding",
                        always: "Always",
                        datePickerLabel: "Expire date",
                        datePickerHintInfo: "Date required",
                        datePickerHintError: "Invalid date!",
                    },
                    score:{
                        baseScore: "CVSS Base Score",
                        impact: "Impact Subscore",
                        exploitability: "Exploitability Subscore",
                        temporalScore: "CVSS Temporal Score",
                        environmental: "CVSS Environmental Score",
                        modifiedImpact: "Modified Impact Subscore",
                        overall: "Overall CVSS Score",
                    },
                    save: "Save",
                },
            },
        },
        navbar: {
            searchbarPlaceholder: "Search projects...",
            profileIconTooltip: "User settings",
            settings: "Settings",
            logout: "Logout"
        },
        sidebar: {
            upperMenu: {
                projects: "Projects",
                projectGroups: "Project Groups",
                privacy: "Data Privacy",
                contact: "Contact"
            },
            lowerMenu: {
                github: "GitHub"
            }
        },
        notificationMessage: {
            noProjectsFound: "No projects found...",
            usernameIsNotMail: "The username must be an e-mail address.",
            incorrectLogin: "Login failed.",
            errorDataFetch: "Error loading the data!",
            errorPageTitle: "Oops, an error occurred.",
            errorPageSubtitle: "Target page not found.",
            errorUserDataFetch: "Error loading userdata from server!",
            saveSuccessfully: "Saved successfully!",
            settingsSaveFailed: "Error saving settings!",
            invalidExpireDate: "Invalid expire date.",
            updateReportFailed: "Error saving report!",
            missingPermission: "No permission!",
            projectCreationFailed: "The project could not be created.",
            apiKeyCreationWarning: "Notice that the API key cannot be reconstructed once you leave the page.",
            saveToClipboardSuccess: "Successfully copied to clipboard.",
            updateSuccessful: "Update successful!",
            updateFailed: "Update failed!",
        },
        filterBox: {
            selectAll: "Select all",
            filter: "Filter"
        },
        dialog: {
            create: "Create...",
            delete: "Delete...",
            areYouSure: "Are you sure?",
            projectId: "Project ID",
            projectIdHelperNotEmpty: "Project ID mustn't be empty.",
            projectIdHelperNoSpaces: "Project ID mustn't contain spaces.",
            projectIdHelperToLong: "Project ID is longer than 20 characters.",
            projectIdHelperIdAlreadyUsed: "Project ID already in use.",
            projectName: "Project name",
            projectNameHelperToLong: "Project name to long.",
            projectSettingTitle: "Project settings",
            imageHash: "Image name",
            notificationThreshold: "Notification threshold",
            userSettingsTitle: "User settings",
            createProject: "Create project",
            deleteProject: "Delete project",
            deleteProjects: "Delete projects",
            cookieDialog: {
                cookieTitle: "Cookies",
                cookieContentText: "SecureCheckPlus by Accso uses cookies to provide you with a better, safer and faster service. " +
                    "Some cookies are necessary to use the services SecureCheckPlus by Accso provides. " +
                    "SecureCheckPlus by Accso only collects necessary data that is required for the application to function properly. " +
                    "You can read exactly which data is collected in the data privacy declaration. " +
                    "By clicking the [Accept] button, you allow us to collect this data and use cookies.",
                acceptCookies: "Accept",
                denyCookies: "Deny"
            }

        },
        toolTips: {
            vendorLink: "Manufacturer information",
            notAvailable: "Not available!",
            missingPermission: "No permission to edit!",
            overwritingAPIKey: "Alert! If new generated, the old API key gets deleted.",
        }
    }
}

// Change default language here
let defaultLanguage = "de"
localStorage.setItem("defaultLanguage", defaultLanguage)
let selected_language = localStorage.getItem("language") ? localStorage.getItem("language") : defaultLanguage;

// @ts-ignore
export default language[selected_language]
