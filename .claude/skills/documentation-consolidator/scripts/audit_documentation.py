#!/usr/bin/env python3
"""
Documentation Audit Script

Scans the .agent/ directory to identify documentation issues:
- Outdated documentation (by comparing with recent Reports/)
- Missing connections between features, bugs, tests
- Inconsistent quality (missing sections, sparse content)
- Orphaned reports not linked to system docs

Usage:
    python3 audit_documentation.py [--path /path/to/project]
"""

import os
import sys
import json
import re
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Set
from collections import defaultdict


class DocumentationAuditor:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.agent_dir = self.project_root / ".agent"
        self.issues = defaultdict(list)

    def audit(self) -> Dict:
        """Run complete documentation audit"""
        print(f"🔍 Auditing documentation in {self.agent_dir}")

        if not self.agent_dir.exists():
            return {"error": f".agent directory not found at {self.agent_dir}"}

        # Run all audit checks
        self._check_outdated_docs()
        self._check_missing_connections()
        self._check_quality_issues()
        self._check_orphaned_reports()

        return self._generate_report()

    def _check_outdated_docs(self):
        """Identify potentially outdated documentation"""
        reports_dir = self.agent_dir / "Reports"
        system_dir = self.agent_dir / "System"

        if not reports_dir.exists():
            return

        # Get recent reports (last 30 days)
        recent_reports = []
        cutoff_date = datetime.now() - timedelta(days=30)

        for report_file in reports_dir.glob("*.md"):
            try:
                # Extract date from filename (format: agent-YYYYMMDD-task.md)
                match = re.search(r'(\d{8})', report_file.name)
                if match:
                    date_str = match.group(1)
                    report_date = datetime.strptime(date_str, "%Y%m%d")
                    if report_date > cutoff_date:
                        recent_reports.append({
                            "file": report_file,
                            "date": report_date,
                            "content": report_file.read_text()
                        })
            except Exception as e:
                self.issues["parsing_errors"].append(f"Could not parse date from {report_file.name}: {e}")

        # Check if System docs reference recent changes
        if system_dir.exists():
            for sys_doc in system_dir.glob("*.md"):
                last_modified = datetime.fromtimestamp(sys_doc.stat().st_mtime)

                # If recent reports exist but system doc hasn't been updated recently
                if recent_reports and last_modified < cutoff_date:
                    self.issues["outdated_docs"].append({
                        "file": str(sys_doc.relative_to(self.project_root)),
                        "last_modified": last_modified.strftime("%Y-%m-%d"),
                        "recent_reports_count": len(recent_reports),
                        "reason": "System documentation not updated despite recent Reports"
                    })

    def _check_missing_connections(self):
        """Check for missing cross-references between docs"""
        tasks_dir = self.agent_dir / "Tasks"
        reports_dir = self.agent_dir / "Reports"
        system_dir = self.agent_dir / "System"

        # Build index of features, bugs, tests from Reports
        features = set()
        bugs = set()
        tests = set()

        if reports_dir.exists():
            for report_file in reports_dir.glob("*.md"):
                name = report_file.name.lower()
                if "test-executor" in name:
                    tests.add(report_file.stem)
                elif "debugger" in name or "bug" in name:
                    bugs.add(report_file.stem)
                else:
                    features.add(report_file.stem)

        # Check if Tasks reference these reports
        if tasks_dir.exists():
            task_files = list(tasks_dir.glob("*.md"))
            for task_file in task_files:
                if task_file.name in ["context.md", "current_plan.md"]:
                    continue

                content = task_file.read_text().lower()

                # Check if task mentions any reports
                mentioned_reports = []
                for report in list(features) + list(bugs) + list(tests):
                    if report.lower() in content:
                        mentioned_reports.append(report)

                if not mentioned_reports and (features or bugs or tests):
                    self.issues["missing_connections"].append({
                        "file": str(task_file.relative_to(self.project_root)),
                        "reason": "Task document doesn't reference any Reports (features/bugs/tests)",
                        "available_reports": len(features) + len(bugs) + len(tests)
                    })

        # Check if System docs reference recent implementations
        if system_dir.exists() and features:
            for sys_doc in system_dir.glob("*.md"):
                content = sys_doc.read_text().lower()

                # Count how many features are mentioned
                mentioned_features = sum(1 for f in features if f.lower() in content)

                if mentioned_features < len(features) * 0.3:  # Less than 30% mentioned
                    self.issues["missing_connections"].append({
                        "file": str(sys_doc.relative_to(self.project_root)),
                        "reason": f"System doc only mentions {mentioned_features}/{len(features)} recent features",
                        "suggestion": "Update system documentation to reflect recent implementations"
                    })

    def _check_quality_issues(self):
        """Check documentation quality and completeness"""
        required_sections = {
            "project_architecture.md": ["## Overview", "## Tech Stack", "## Directory Structure"],
            "database_schema.md": ["## Tables", "## Relationships"],
            "api_endpoints.md": ["## Endpoints", "## Request", "## Response"],
        }

        system_dir = self.agent_dir / "System"
        if not system_dir.exists():
            self.issues["quality_issues"].append({
                "severity": "high",
                "reason": ".agent/System/ directory does not exist",
                "suggestion": "Create System/ directory with core documentation"
            })
            return

        for doc_name, sections in required_sections.items():
            doc_path = system_dir / doc_name
            if not doc_path.exists():
                self.issues["quality_issues"].append({
                    "file": f".agent/System/{doc_name}",
                    "severity": "medium",
                    "reason": "Required documentation file missing",
                    "suggestion": f"Create {doc_name} with sections: {', '.join(sections)}"
                })
                continue

            content = doc_path.read_text()
            missing_sections = [s for s in sections if s not in content]

            if missing_sections:
                self.issues["quality_issues"].append({
                    "file": str(doc_path.relative_to(self.project_root)),
                    "severity": "low",
                    "reason": f"Missing required sections: {', '.join(missing_sections)}",
                    "suggestion": "Add missing sections for completeness"
                })

            # Check if document is too sparse (< 500 chars is suspiciously short)
            if len(content) < 500:
                self.issues["quality_issues"].append({
                    "file": str(doc_path.relative_to(self.project_root)),
                    "severity": "medium",
                    "reason": f"Document is sparse ({len(content)} chars)",
                    "suggestion": "Add more detail and context"
                })

    def _check_orphaned_reports(self):
        """Check for reports not referenced in other documentation"""
        reports_dir = self.agent_dir / "Reports"
        if not reports_dir.exists():
            return

        # Get all reports
        reports = list(reports_dir.glob("*.md"))

        # Check which reports are referenced in Tasks/ or System/
        referenced_reports = set()

        for doc_dir in [self.agent_dir / "Tasks", self.agent_dir / "System"]:
            if not doc_dir.exists():
                continue

            for doc_file in doc_dir.glob("*.md"):
                content = doc_file.read_text()
                for report in reports:
                    if report.stem in content or report.name in content:
                        referenced_reports.add(report.name)

        # Find orphaned reports
        for report in reports:
            if report.name not in referenced_reports:
                self.issues["orphaned_reports"].append({
                    "file": str(report.relative_to(self.project_root)),
                    "reason": "Report not referenced in Tasks/ or System/ documentation",
                    "suggestion": "Link this report to relevant task/system docs or archive if outdated"
                })

    def _generate_report(self) -> Dict:
        """Generate structured audit report"""
        total_issues = sum(len(v) for v in self.issues.values())

        report = {
            "audit_date": datetime.now().isoformat(),
            "project_root": str(self.project_root),
            "summary": {
                "total_issues": total_issues,
                "categories": {k: len(v) for k, v in self.issues.items()}
            },
            "issues": dict(self.issues)
        }

        return report


def format_report(audit_result: Dict) -> str:
    """Format audit result as readable text"""
    if "error" in audit_result:
        return f"❌ Error: {audit_result['error']}"

    lines = []
    lines.append("=" * 80)
    lines.append("📋 DOCUMENTATION AUDIT REPORT")
    lines.append("=" * 80)
    lines.append(f"Date: {audit_result['audit_date']}")
    lines.append(f"Project: {audit_result['project_root']}")
    lines.append("")

    summary = audit_result['summary']
    lines.append("📊 SUMMARY")
    lines.append("-" * 80)
    lines.append(f"Total Issues: {summary['total_issues']}")
    lines.append("")

    for category, count in summary['categories'].items():
        lines.append(f"  • {category.replace('_', ' ').title()}: {count}")

    lines.append("")
    lines.append("=" * 80)
    lines.append("")

    # Detail each category
    issues = audit_result['issues']

    if issues.get('outdated_docs'):
        lines.append("🕒 OUTDATED DOCUMENTATION")
        lines.append("-" * 80)
        for issue in issues['outdated_docs']:
            lines.append(f"File: {issue['file']}")
            lines.append(f"  Last Modified: {issue['last_modified']}")
            lines.append(f"  Recent Reports: {issue['recent_reports_count']}")
            lines.append(f"  Reason: {issue['reason']}")
            lines.append("")

    if issues.get('missing_connections'):
        lines.append("🔗 MISSING CONNECTIONS")
        lines.append("-" * 80)
        for issue in issues['missing_connections']:
            lines.append(f"File: {issue['file']}")
            lines.append(f"  Reason: {issue['reason']}")
            if 'suggestion' in issue:
                lines.append(f"  💡 Suggestion: {issue['suggestion']}")
            if 'available_reports' in issue:
                lines.append(f"  Available Reports: {issue['available_reports']}")
            lines.append("")

    if issues.get('quality_issues'):
        lines.append("⚠️  QUALITY ISSUES")
        lines.append("-" * 80)
        for issue in issues['quality_issues']:
            lines.append(f"File: {issue.get('file', 'N/A')}")
            lines.append(f"  Severity: {issue['severity'].upper()}")
            lines.append(f"  Reason: {issue['reason']}")
            lines.append(f"  💡 Suggestion: {issue['suggestion']}")
            lines.append("")

    if issues.get('orphaned_reports'):
        lines.append("🗂️  ORPHANED REPORTS")
        lines.append("-" * 80)
        for issue in issues['orphaned_reports']:
            lines.append(f"File: {issue['file']}")
            lines.append(f"  Reason: {issue['reason']}")
            lines.append(f"  💡 Suggestion: {issue['suggestion']}")
            lines.append("")

    if issues.get('parsing_errors'):
        lines.append("⚠️  PARSING ERRORS")
        lines.append("-" * 80)
        for error in issues['parsing_errors']:
            lines.append(f"  • {error}")
        lines.append("")

    lines.append("=" * 80)
    lines.append("✅ Audit complete")
    lines.append("=" * 80)

    return "\n".join(lines)


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Audit documentation quality in .agent/ directory")
    parser.add_argument("--path", default=".", help="Path to project root (default: current directory)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    args = parser.parse_args()

    auditor = DocumentationAuditor(args.path)
    result = auditor.audit()

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(format_report(result))


if __name__ == "__main__":
    main()
