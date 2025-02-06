import { nodeGroup } from "framer-motion/types/projection/node/group";

const NOT_DEFINED = "Not Defined";
const NOT_DEFINED_REQ = "Assigning this value indicates there is insufficient information to choose one of the other values, and has no impact on the overall Environmental Score, i.e., it has the same effect on scoring as assigning Medium.";
const LOW = "Low";
const MEDIUM = "Medium";
const HIGH = "High";
const NONE = "None";
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
                        exploitCodeMaturity: {
                            notDefined: {title: NOT_DEFINED, tooltip: "Assigning this value indicates there is insufficient information to choose one of the other values, and has no impact on the overall Temporal Score, i.e., it has the same effect on scoring as assigning High."},
                            unproven: {title: "Unproven", tooltip: "No exploit code is available, or an exploit is theoretical."},
                            proofOfConcept: {title: "Proof-of-Concept", tooltip: "Proof-of-concept exploit code is available, or an attack demonstration is not practical for most systems. The code or technique is not functional in all situations and may require substantial modification by a skilled attacker."},
                            functional: {title: "Functional", tooltip: "Functional exploit code is available. The code works in most situations where the vulnerability exists."},
                            high: {title: "High", tooltip: "Functional autonomous code exists, or no exploit is required (manual trigger) and details are widely available. Exploit code works in every situation, or is actively being delivered via an autonomous agent (such as a worm or virus). Network-connected systems are likely to encounter scanning or exploitation attempts. Exploit development has reached the level of reliable, widely available, easy-to-use automated tools."}
                        },
                        remediationLevel: {
                            notDefined: {title: NOT_DEFINED, tooltip: "Assigning this value indicates there is insufficient information to choose one of the other values, and has no impact on the overall Temporal Score, i.e., it has the same effect on scoring as assigning Unavailable."},
                            officialFix: {title: "Official fix", tooltip: "A complete vendor solution is available. Either the vendor has issued an official patch, or an upgrade is available."},
                            temporaryFix: {title: "Temporary fix", tooltip: "There is an official but temporary fix available. This includes instances where the vendor issues a temporary hotfix, tool, or workaround."},
                            workaround: {title: "Workaround", tooltip: "There is an unofficial, non-vendor solution available. In some cases, users of the affected technology will create a patch of their own or provide steps to work around or otherwise mitigate the vulnerability."},
                            unavailable: {title: "Unavailable", tooltip: "There is either no solution available or it is impossible to apply."},
                        },
                        reportConfidence: {
                            notDefined: {title: NOT_DEFINED, tooltip: "Assigning this value indicates there is insufficient information to choose one of the other values, and has no impact on the overall Temporal Score, i.e., it has the same effect on scoring as assigning Confirmed."},
                            unknown: {title: "Unknown", tooltip: "There are reports of impacts that indicate a vulnerability is present. The reports indicate that the cause of the vulnerability is unknown, or reports may differ on the cause or impacts of the vulnerability. Reporters are uncertain of the true nature of the vulnerability, and there is little confidence in the validity of the reports or whether a static Base Score can be applied given the differences described. An example is a bug report which notes that an intermittent but non-reproducible crash occurs, with evidence of memory corruption suggesting that denial of service, or possible more serious impacts, may result."},
                            reasonable: {title: "Reasonable", tooltip: "Significant details are published, but researchers either do not have full confidence in the root cause, or do not have access to source code to fully confirm all of the interactions that may lead to the result. Reasonable confidence exists, however, that the bug is reproducible and at least one impact is able to be verified (proof-of-concept exploits may provide this). An example is a detailed write-up of research into a vulnerability with an explanation (possibly obfuscated or “left as an exercise to the reader”) that gives assurances on how to reproduce the results."},
                            confirmed: {title: "Confirmed", tooltip: "Detailed reports exist, or functional reproduction is possible (functional exploits may provide this). Source code is available to independently verify the assertions of the research, or the author or vendor of the affected code has confirmed the presence of the vulnerability."}
                        },
                        confidentialityRequirement: {
                            notDefined: {title: NOT_DEFINED, tooltip: NOT_DEFINED_REQ},
                            low: {title: LOW, tooltip: "Loss of Confidentiality is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            medium: {title: MEDIUM, tooltip: "Loss of Confidentiality is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            high: {title: HIGH, tooltip: "Loss of Confidentiality is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."}
                        },
                        integrityRequirement: {
                            notDefined: {title: NOT_DEFINED, tooltip: NOT_DEFINED_REQ},
                            low: {title: LOW, tooltip: "Loss of ${text} is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            medium: {title: MEDIUM, tooltip: "Loss of Integrity is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            high: {title: HIGH, tooltip: "Loss of Integrity is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."}
                        },
                        availabilityRequirement: {
                            notDefined: {title: NOT_DEFINED, tooltip: NOT_DEFINED_REQ},
                            low: {title: LOW, tooltip: "Loss of Availability is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            medium: {title: MEDIUM, tooltip: "Loss of Availability is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            high: {title: HIGH, tooltip: "Loss of Availability is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."}
                        },
                        modifiedAttackVector: {
                            notDefined: {title: NOT_DEFINED, tooltip: "The default value."},
                            network: {title: "Network", tooltip: "The vulnerable component is bound to the network stack and the set of possible attackers extends beyond the other options listed below, up to and including the entire Internet. Such a vulnerability is often termed “remotely exploitable” and can be thought of as an attack being exploitable at the protocol level one or more network hops away (e.g., across one or more routers). An example of a network attack is an attacker causing a denial of service (DoS) by sending a specially crafted TCP packet across a wide area network (e.g., CVE‑2004‑0230)."},
                            adjacent: {title: "Adjacent", tooltip: "The vulnerable component is bound to the network stack, but the attack is limited at the protocol level to a logically adjacent topology. This can mean an attack must be launched from the same shared physical (e.g., Bluetooth or IEEE 802.11) or logical (e.g., local IP subnet) network, or from within a secure or otherwise limited administrative domain (e.g., MPLS, secure VPN to an administrative network zone). One example of an Adjacent attack would be an ARP (IPv4) or neighbor discovery (IPv6) flood leading to a denial of service on the local LAN segment (e.g., CVE‑2013‑6014)."},
                            local: {title: "Local", tooltip: "The vulnerable component is not bound to the network stack and the attacker’s path is via read/write/execute capabilities. Either: the attacker exploits the vulnerability by accessing the target system locally (e.g., keyboard, console), or remotely (e.g., SSH); or the attacker relies on User Interaction by another person to perform actions required to exploit the vulnerability (e.g., using social engineering techniques to trick a legitimate user into opening a malicious document)."},
                            physical: {title: "Physical", tooltip: "The attack requires the attacker to physically touch or manipulate the vulnerable component. Physical interaction may be brief (e.g., evil maid attack1) or persistent. An example of such an attack is a cold boot attack in which an attacker gains access to disk encryption keys after physically accessing the target system. Other examples include peripheral attacks via FireWire/USB Direct Memory Access (DMA)."}
                        },
                        modifiedAttackComplexity: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            low: {title: LOW, tooltip: "somePlaceholder"},
                            high: {title: HIGH, tooltip: "somePlaceholder"}
                        },
                        modifiedPrivilegesRequired: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            none: {title: NONE, tooltip: "somePlaceholder"},
                            low: {title: LOW, tooltip: "somePlaceholder"},
                            high: {title: HIGH, tooltip: "somePlaceholder"}
                        },
                        modifiedUserInteraction: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            none: {title: NONE, tooltip: "somePlaceholder"},
                            required: {title: "Required", tooltip: "somePlaceholder"}
                        },
                        modifiedScope: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            unchanged: {title: "Unchanged", tooltip: "somePlaceholder"},
                            changed: {title: "Changed", tooltip: "somePlaceholder"}
                        },
                        modifiedConfidentiality: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            none: {title: NONE, tooltip: "somePlaceholder"},
                            low: {title: LOW, tooltip: "somePlaceholder"},
                            high: {title: HIGH, tooltip: "somePlaceholder"}
                        },
                        modifiedIntegrity: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            none: {title: NONE, tooltip: "somePlaceholder"},
                            low: {title: LOW, tooltip: "somePlaceholder"},
                            high: {title: HIGH, tooltip: "somePlaceholder"}
                        },
                        modifiedAvailability: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            none: {title: NONE, tooltip: "somePlaceholder"},
                            low: {title: LOW, tooltip: "somePlaceholder"},
                            high: {title: HIGH, tooltip: "somePlaceholder"}
                        } 
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
                        exploitCodeMaturity: {
                            notDefined: {title: NOT_DEFINED, tooltip: "Assigning this value indicates there is insufficient information to choose one of the other values, and has no impact on the overall Temporal Score, i.e., it has the same effect on scoring as assigning High."},
                            unproven: {title: "Unproven", tooltip: "No exploit code is available, or an exploit is theoretical."},
                            proofOfConcept: {title: "Proof-of-Concept", tooltip: "Proof-of-concept exploit code is available, or an attack demonstration is not practical for most systems. The code or technique is not functional in all situations and may require substantial modification by a skilled attacker."},
                            functional: {title: "Functional", tooltip: "Functional exploit code is available. The code works in most situations where the vulnerability exists."},
                            high: {title: "High", tooltip: "Functional autonomous code exists, or no exploit is required (manual trigger) and details are widely available. Exploit code works in every situation, or is actively being delivered via an autonomous agent (such as a worm or virus). Network-connected systems are likely to encounter scanning or exploitation attempts. Exploit development has reached the level of reliable, widely available, easy-to-use automated tools."}
                        },
                        remediationLevel: {
                            notDefined: {title: NOT_DEFINED, tooltip: "Assigning this value indicates there is insufficient information to choose one of the other values, and has no impact on the overall Temporal Score, i.e., it has the same effect on scoring as assigning Unavailable."},
                            officialFix: {title: "Official fix", tooltip: "A complete vendor solution is available. Either the vendor has issued an official patch, or an upgrade is available."},
                            temporaryFix: {title: "Temporary fix", tooltip: "There is an official but temporary fix available. This includes instances where the vendor issues a temporary hotfix, tool, or workaround."},
                            workaround: {title: "Workaround", tooltip: "There is an unofficial, non-vendor solution available. In some cases, users of the affected technology will create a patch of their own or provide steps to work around or otherwise mitigate the vulnerability."},
                            unavailable: {title: "Unavailable", tooltip: "There is either no solution available or it is impossible to apply."},
                        },
                        reportConfidence: {
                            notDefined: {title: NOT_DEFINED, tooltip: "Assigning this value indicates there is insufficient information to choose one of the other values, and has no impact on the overall Temporal Score, i.e., it has the same effect on scoring as assigning Confirmed."},
                            unknown: {title: "Unknown", tooltip: "There are reports of impacts that indicate a vulnerability is present. The reports indicate that the cause of the vulnerability is unknown, or reports may differ on the cause or impacts of the vulnerability. Reporters are uncertain of the true nature of the vulnerability, and there is little confidence in the validity of the reports or whether a static Base Score can be applied given the differences described. An example is a bug report which notes that an intermittent but non-reproducible crash occurs, with evidence of memory corruption suggesting that denial of service, or possible more serious impacts, may result."},
                            reasonable: {title: "Reasonable", tooltip: "Significant details are published, but researchers either do not have full confidence in the root cause, or do not have access to source code to fully confirm all of the interactions that may lead to the result. Reasonable confidence exists, however, that the bug is reproducible and at least one impact is able to be verified (proof-of-concept exploits may provide this). An example is a detailed write-up of research into a vulnerability with an explanation (possibly obfuscated or “left as an exercise to the reader”) that gives assurances on how to reproduce the results."},
                            confirmed: {title: "Confirmed", tooltip: "Detailed reports exist, or functional reproduction is possible (functional exploits may provide this). Source code is available to independently verify the assertions of the research, or the author or vendor of the affected code has confirmed the presence of the vulnerability."}
                        },
                        confidentialityRequirement: {
                            notDefined: {title: NOT_DEFINED, tooltip: NOT_DEFINED_REQ},
                            low: {title: LOW, tooltip: "Loss of Confidentiality is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            medium: {title: MEDIUM, tooltip: "Loss of [Confidentiality | Integrity | Availability] is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            high: {title: HIGH, tooltip: "Loss of [Confidentiality | Integrity | Availability] is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."}
                        },
                        integrityRequirement: {
                            notDefined: {title: NOT_DEFINED, tooltip: NOT_DEFINED_REQ},
                            low: {title: LOW, tooltip: "Loss of Confidentiality is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            medium: {title: MEDIUM, tooltip: "Loss of [Confidentiality | Integrity | Availability] is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            high: {title: HIGH, tooltip: "Loss of [Confidentiality | Integrity | Availability] is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."}
                        },
                        availabilityRequirement: {
                            notDefined: {title: NOT_DEFINED, tooltip: NOT_DEFINED_REQ},
                            low: {title: LOW, tooltip: "Loss of Confidentiality is likely to have only a limited adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            medium: {title: MEDIUM, tooltip: "Loss of [Confidentiality | Integrity | Availability] is likely to have a serious adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."},
                            high: {title: HIGH, tooltip: "Loss of [Confidentiality | Integrity | Availability] is likely to have a catastrophic adverse effect on the organization or individuals associated with the organization (e.g., employees, customers)."}
                        },
                        modifiedAttackVector: {
                            notDefined: {title: NOT_DEFINED, tooltip: "The default value."},
                            network: {title: "Network", tooltip: "The vulnerable component is bound to the network stack and the set of possible attackers extends beyond the other options listed below, up to and including the entire Internet. Such a vulnerability is often termed “remotely exploitable” and can be thought of as an attack being exploitable at the protocol level one or more network hops away (e.g., across one or more routers). An example of a network attack is an attacker causing a denial of service (DoS) by sending a specially crafted TCP packet across a wide area network (e.g., CVE‑2004‑0230)."},
                            adjacent: {title: "Adjacent", tooltip: "The vulnerable component is bound to the network stack, but the attack is limited at the protocol level to a logically adjacent topology. This can mean an attack must be launched from the same shared physical (e.g., Bluetooth or IEEE 802.11) or logical (e.g., local IP subnet) network, or from within a secure or otherwise limited administrative domain (e.g., MPLS, secure VPN to an administrative network zone). One example of an Adjacent attack would be an ARP (IPv4) or neighbor discovery (IPv6) flood leading to a denial of service on the local LAN segment (e.g., CVE‑2013‑6014)."},
                            local: {title: "Local", tooltip: "The vulnerable component is not bound to the network stack and the attacker’s path is via read/write/execute capabilities. Either: the attacker exploits the vulnerability by accessing the target system locally (e.g., keyboard, console), or remotely (e.g., SSH); or the attacker relies on User Interaction by another person to perform actions required to exploit the vulnerability (e.g., using social engineering techniques to trick a legitimate user into opening a malicious document)."},
                            physical: {title: "Physical", tooltip: "The attack requires the attacker to physically touch or manipulate the vulnerable component. Physical interaction may be brief (e.g., evil maid attack1) or persistent. An example of such an attack is a cold boot attack in which an attacker gains access to disk encryption keys after physically accessing the target system. Other examples include peripheral attacks via FireWire/USB Direct Memory Access (DMA)."}
                        },
                        modifiedAttackComplexity: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            low: {title: LOW, tooltip: "somePlaceholder"},
                            high: {title: HIGH, tooltip: "somePlaceholder"}
                        },
                        modifiedPrivilegesRequired: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            none: {title: NONE, tooltip: "somePlaceholder"},
                            low: {title: LOW, tooltip: "somePlaceholder"},
                            high: {title: HIGH, tooltip: "somePlaceholder"}
                        },
                        modifiedUserInteraction: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            none: {title: NONE, tooltip: "somePlaceholder"},
                            required: {title: "Required", tooltip: "somePlaceholder"}
                        },
                        modifiedScope: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            unchanged: {title: "Unchanged", tooltip: "somePlaceholder"},
                            changed: {title: "Changed", tooltip: "somePlaceholder"}
                        },
                        modifiedConfidentiality: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            none: {title: NONE, tooltip: "somePlaceholder"},
                            low: {title: LOW, tooltip: "somePlaceholder"},
                            high: {title: HIGH, tooltip: "somePlaceholder"}
                        },
                        modifiedIntegrity: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            none: {title: NONE, tooltip: "somePlaceholder"},
                            low: {title: LOW, tooltip: "somePlaceholder"},
                            high: {title: HIGH, tooltip: "somePlaceholder"}
                        },
                        modifiedAvailability: {
                            notDefined: {title: NOT_DEFINED, tooltip: "somePlaceholder"},
                            none: {title: NONE, tooltip: "somePlaceholder"},
                            low: {title: LOW, tooltip: "somePlaceholder"},
                            high: {title: HIGH, tooltip: "somePlaceholder"}
                        } 
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
