package dao;

import java.io.File;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;
import org.semanticweb.owlapi.model.OWLOntologyManager;

public class OntologyDAO {

    private static OntologyDAO instance = new OntologyDAO();

    private String assertedFile = "C:/Users/Weiner/Documents/NetBeansProjects/SPPV2/SPPV/src/main/webapp/owl/ont1-50A.owl";
    private String inferredFile = "C:/Users/Weiner/Documents/NetBeansProjects/SPPV2/SPPV/src/main/webapp/owl/ont1-50I.owl";
    
    private String uri = "http://www.w3.org/ns/prov#";
    private OWLOntology inferredOntology;
    private OWLOntology assertedOontology;
    private OWLOntologyManager inferredManager;
    private OWLOntologyManager assertedManager;

    private OntologyDAO() {
        inferredManager = OWLManager.createOWLOntologyManager();
        File inputOntologyFile = new File(inferredFile);
        try {
            inferredOntology = inferredManager.loadOntologyFromOntologyDocument(inputOntologyFile);
        } catch (OWLOntologyCreationException ex) {
            System.err.println("Não foi possível carregar a ontologia.");
            System.err.println(ex.getMessage());
            Logger.getLogger(OntologyDAO.class.getName()).log(Level.SEVERE, null, ex);

        }
        assertedManager = OWLManager.createOWLOntologyManager();
        File inputAssertedOntologyFile = new File(assertedFile);
        try {
            assertedOontology = assertedManager.loadOntologyFromOntologyDocument(inputAssertedOntologyFile);
        } catch (OWLOntologyCreationException ex) {
            System.err.println("Não foi possível carregar a ontologia.");
            System.err.println(ex.getMessage());
            Logger.getLogger(OntologyDAO.class.getName()).log(Level.SEVERE, null, ex);

        }
    }

    public static OntologyDAO getInstance() {
        return instance;
    }

    public OWLOntology getInferredOntology() {
        return inferredOntology;
    }

    public OWLOntology getAssertedOntology() {
        return assertedOontology;
    }

    public String getAssertedFile() {
        return assertedFile;
    }

    public String getInferredFile() {
        return inferredFile;
    }

    public String getUri() {
        return uri;
    }
}
