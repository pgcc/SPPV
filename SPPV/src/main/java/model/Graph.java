package model;

import java.util.ArrayList;

public class Graph {

    private ArrayList<Node> nodes;
    private ArrayList<Path> paths;

    public Graph() {
        this.nodes = new ArrayList<>();
        this.paths = new ArrayList<>();
    }

    public ArrayList<Node> getNodes() {
        return nodes;
    }

    public void addNode(Node node) {
        this.nodes.add(node);
    }

    public ArrayList<Path> getEdges() {
        return paths;
    }

    public void addLink(Node source, ArrayList<Node> targets, ArrayList<String> names) {
        for (int s = 0; s < nodes.size(); s++) {
            if (nodes.get(s).sameAs(source)) {
                for (int i = 0; i < targets.size(); i++) {
                    Node target = targets.get(i);
                    for (int t = 0; t < nodes.size(); t++) {
                        if (nodes.get(t).sameAs(target)) {
                            Path path = findPath(s, t);
                            if (path == null) {
                                path = new Path(s, t);
                                path.addLink(new Link(names.get(i), true));
                                paths.add(path);
                            } else {
                                path.addLink(new Link(names.get(i), true));
                            }
                        }
                    }
                }
                break;
            }
        }
    }

    /*
    public void assertLinks(String name, Node source, ArrayList<Node> targets) {
        int size = nodes.size();
        for (int s = 0; s < size; s++) {
            if (nodes.get(s).sameAs(source)) {
                for (Node target : targets) {
                    for (int t = 0; t < size; t++) {
                        if (nodes.get(t).sameAs(target)) {
                            Path path = findPath(s, t);
                            if (path != null) {
                                //path.setInferred(false);
                            }
                        }
                    }
                }
            }
        }
    }*/

    private Path findPath(int s, int t) {
        Path path;
        for (int i = 0; i < paths.size(); i++) {
            path = paths.get(i);
            if (path.getSource() == s && path.getTarget() == t) {
                return path;
            }
        }
        return null;
    }
}
