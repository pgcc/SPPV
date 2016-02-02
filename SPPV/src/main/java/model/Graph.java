package model;

import java.util.ArrayList;

public class Graph {

    private ArrayList<Node> nodes;
    private ArrayList<Link> links;

    public Graph() {
        this.nodes = new ArrayList<>();
        this.links = new ArrayList<>();
    }

    public ArrayList<Node> getNodes() {
        return nodes;
    }

    public void addNode(Node node) {
        this.nodes.add(node);
    }

    public ArrayList<Link> getLinks() {
        return links;
    }

    public void assertLinks(String name, Node source, ArrayList<Node> targets) {
        int size = nodes.size();
        for (int s = 0; s < size; s++) {
            if (nodes.get(s).sameAs(source)) {
                for (Node target : targets) {
                    for (int t = 0; t < size; t++) {
                        if (nodes.get(t).sameAs(target)) {
                            Link link = findLink(s, t);
                            if (link != null) {
                                link.setInferred(false);
                            }
                        }
                    }
                }
            }
        }
    }

    public void addLinks(String name, boolean inferred, Node source, ArrayList<Node> targets) {
        int size = nodes.size();
        for (int s = 0; s < size; s++) {
            if (nodes.get(s).sameAs(source)) {
                for (Node target : targets) {
                    for (int t = 0; t < size; t++) {
                        if (nodes.get(t).sameAs(target)) {
                            Link link = findLink(s, t);
                            if (link == null) {
                                links.add(new Link(name, inferred, s, t));
                            }
                            //Adiciona lista de ligações------------------------
                        }
                    }
                }
            }
        }
    }

    public boolean lookFor(Link link) {
        return true;
    }

    private Link findLink(int s, int t) {
        Link link;
        for (int i = 0; i < links.size(); i++) {
            link = links.get(i);
            if (link.getSource() == s && link.getTarget() == t) {
                return link;
            }
        }
        return null;
    }
}
