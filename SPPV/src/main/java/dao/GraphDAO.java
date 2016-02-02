package dao;

import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import model.Graph;
import model.Node;
import org.semanticweb.owlapi.model.OWLClassExpression;
import org.semanticweb.owlapi.model.OWLIndividual;
import org.semanticweb.owlapi.model.OWLNamedIndividual;
import org.semanticweb.owlapi.model.OWLObjectPropertyExpression;

public class GraphDAO {

    private static GraphDAO instance = new GraphDAO();
    private Graph inferredGraph;

    private GraphDAO() {
        //Inferred Graph
        inferredGraph = new Graph();
        //Load Nodes
        Set<OWLNamedIndividual> individuals = OntologyDAO.getInstance().getInferredOntology().getIndividualsInSignature();
        for (OWLNamedIndividual individual : individuals) {
            Set<OWLClassExpression> types = individual.getTypes(OntologyDAO.getInstance().getInferredOntology());
            if (!types.isEmpty()) {
                String name = individual.getIRI().getFragment();
                String type = types.toString();
                type = filterUrl(type);
                inferredGraph.addNode(new Node(name, type));
            }
        }
        //Load Links
        for (OWLNamedIndividual individual : individuals) {
            Set<OWLClassExpression> types = individual.getTypes(OntologyDAO.getInstance().getInferredOntology());
            if (!types.isEmpty()) {
                String name = individual.getIRI().getFragment();
                String type = types.toString();
                type = filterUrl(type);
                Node source = new Node(name, type);
                ArrayList<Node> targets = new ArrayList<>();
                Map<OWLObjectPropertyExpression, Set<OWLIndividual>> individualMap = individual.getObjectPropertyValues(OntologyDAO.getInstance().getInferredOntology());
                Set<OWLObjectPropertyExpression> propertiesSet = individualMap.keySet();
                for (OWLObjectPropertyExpression property : propertiesSet) {
                    Set<OWLIndividual> individualSet = individualMap.get(property);
                    for (OWLIndividual individualProperty : individualSet) {
                        Set<OWLClassExpression> targetTypes = individualProperty.getTypes(OntologyDAO.getInstance().getInferredOntology());
                        //String propertyName = individualProperty.toStringID();
                        if (!targetTypes.isEmpty()) {
                            String targetName = individualProperty.asOWLNamedIndividual().getIRI().getFragment();
                            String targetType = targetTypes.toString();
                            targetType = filterUrl(targetType);
                            targets.add(new Node(targetName, targetType));
                        }
                    }
                }
                if (!targets.isEmpty()) {
                    inferredGraph.addLinks(name, true, source, targets);
                }
            }
        }
        //Asserted Graph
        Graph assertedGraph = new Graph();
        //Load Asserted Nodes
        Set<OWLNamedIndividual> assertedIndividuals = OntologyDAO.getInstance().getInferredOntology().getIndividualsInSignature();
        for (OWLNamedIndividual individual : assertedIndividuals) {
            Set<OWLClassExpression> types = individual.getTypes(OntologyDAO.getInstance().getInferredOntology());
            if (!types.isEmpty()) {
                String name = individual.getIRI().getFragment();
                String type = types.toString();
                type = filterUrl(type);
                assertedGraph.addNode(new Node(name, type));
            }
        }
        //Load Asserted Lnks
        for (OWLNamedIndividual individual : assertedIndividuals) {
            Set<OWLClassExpression> types = individual.getTypes(OntologyDAO.getInstance().getAssertedOntology());
            if (!types.isEmpty()) {
                String name = individual.getIRI().getFragment();
                String type = types.toString();
                type = filterUrl(type);
                Node source = new Node(name, type);
                ArrayList<Node> targets = new ArrayList<>();
                Map<OWLObjectPropertyExpression, Set<OWLIndividual>> individualMap = individual.getObjectPropertyValues(OntologyDAO.getInstance().getAssertedOntology());
                Set<OWLObjectPropertyExpression> propertiesSet = individualMap.keySet();
                for (OWLObjectPropertyExpression property : propertiesSet) {
                    Set<OWLIndividual> individualSet = individualMap.get(property);
                    for (OWLIndividual individualProperty : individualSet) {
                        Set<OWLClassExpression> targetTypes = individualProperty.getTypes(OntologyDAO.getInstance().getAssertedOntology());
                        //String propertyName = individualProperty.toStringID();
                        if (!targetTypes.isEmpty()) {
                            String targetName = individualProperty.asOWLNamedIndividual().getIRI().getFragment();
                            String targetType = targetTypes.toString();
                            targetType = filterUrl(targetType);
                            targets.add(new Node(targetName, targetType));
                        }
                    }
                }
                if (!targets.isEmpty()) {
                    inferredGraph.assertLinks(name, source, targets);
                }
            }
        }
    }

    public static GraphDAO getInstance() {
        return instance;
    }

    public Graph readGraph() {
        return inferredGraph;
    }

    private String filterUrl(String url) {
        String reply;
        String[] array;
        array = url.split("#");
        if (array.length > 1) {
            reply = array[1];
        } else {
            reply = array[0];
        }
        if (reply.contains(">")) {
            array = reply.split(">");
            reply = array[0];
        } else {
            reply = reply.substring(0, reply.length() - 2);
        }
        return reply;
    }
}
