"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { type Experience } from "@prisma/client";
import "@fontsource-variable/geist/wght.css";

// Register fonts
Font.register({
  family: "Geist",
  fonts: [
    {
      src: "node_modules/@fontsource-variable/geist/files/geist-variable-latin-wght-normal.woff2",
      fontWeight: "normal",
    },
    {
      src: "node_modules/@fontsource-variable/geist/files/geist-variable-latin-wght-normal.woff2",
      fontWeight: "bold",
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Geist",
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontFamily: "Geist",
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  contact: {
    fontSize: 10,
    color: "#666",
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Geist",
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    borderBottom: "1px solid #EEE",
    paddingBottom: 5,
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 12,
    fontFamily: "Geist",
    fontWeight: "bold",
    marginBottom: 3,
  },
  company: {
    fontSize: 11,
    color: "#666",
    marginBottom: 3,
  },
  period: {
    fontSize: 10,
    color: "#888",
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    marginBottom: 5,
    lineHeight: 1.4,
  },
  achievements: {
    marginLeft: 15,
    marginBottom: 5,
  },
  achievement: {
    fontSize: 10,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 5,
  },
  skill: {
    fontSize: 9,
    backgroundColor: "#F3F4F6",
    padding: "3 6",
    borderRadius: 3,
  },
});

interface ResumeProps {
  experiences: Experience[];
}

export function Resume({ experiences }: ResumeProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>Marc Stämpfli</Text>
          <Text style={styles.title}>Full Stack Developer</Text>
          <Text style={styles.contact}>hello@marcstampfli.com</Text>
          <Text style={styles.contact}>Trinidad and Tobago</Text>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.description}>
            Full Stack Developer with over a decade of experience in web
            development, design, and digital solutions. Passionate about
            creating intuitive user experiences and solving complex technical
            challenges.
          </Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{exp.title}</Text>
              <Text style={styles.company}>{exp.company}</Text>
              <Text style={styles.period}>{exp.period}</Text>
              <Text style={styles.description}>{exp.description}</Text>

              {/* Achievements */}
              <View style={styles.achievements}>
                {exp.achievements.map((achievement, index) => (
                  <Text key={index} style={styles.achievement}>
                    • {achievement}
                  </Text>
                ))}
              </View>

              {/* Tech Stack */}
              <View style={styles.skills}>
                {exp.tech_stack.map((tech, index) => (
                  <Text key={index} style={styles.skill}>
                    {tech}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
