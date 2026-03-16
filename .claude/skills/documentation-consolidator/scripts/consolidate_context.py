#!/usr/bin/env python3
"""
Context Consolidation Script

Generates consolidated summaries from scattered documentation:
- Feature status summary (from Tasks/ + Reports/)
- Active bugs and fixes (from Reports/debugger-*)
- Testing status (from Reports/test-executor-*)
- System state snapshot (from System/)

Usage:
    python3 consolidate_context.py [--path /path/to/project] [--output /path/to/output.md]
"""

import os
import sys
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple
from collections import defaultdict


class ContextConsolidator:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.agent_dir = self.project_root / ".agent"

    def consolidate(self) -> Dict:
        """Generate consolidated context summary"""
        print(f"📦 Consolidating context from {self.agent_dir}")

        if not self.agent_dir.exists():
            return {"error": f".agent directory not found at {self.agent_dir}"}

        consolidated = {
            "generated_at": datetime.now().isoformat(),
            "project_root": str(self.project_root),
            "features": self._consolidate_features(),
            "bugs_and_fixes": self._consolidate_bugs(),
            "testing_status": self._consolidate_tests(),
            "system_state": self._consolidate_system(),
            "active_tasks": self._consolidate_tasks()
        }

        return consolidated

    def _consolidate_features(self) -> List[Dict]:
        """Extract feature information from Reports and Tasks"""
        features = []
        reports_dir = self.agent_dir / "Reports"

        if not reports_dir.exists():
            return features

        for report_file in sorted(reports_dir.glob("*.md"), key=lambda p: p.stat().st_mtime, reverse=True):
            # Skip debugger and test reports
            if "debugger" in report_file.name.lower() or "test-executor" in report_file.name.lower():
                continue

            try:
                content = report_file.read_text()

                # Extract date from filename
                match = re.search(r'(\d{8})', report_file.name)
                date_str = match.group(1) if match else "unknown"

                # Try to extract feature name from content (look for # headers)
                feature_name = None
                for line in content.split('\n')[:20]:  # Check first 20 lines
                    if line.startswith('# '):
                        feature_name = line[2:].strip()
                        break

                if not feature_name:
                    feature_name = report_file.stem

                # Extract implementation status
                status = "unknown"
                if "completed" in content.lower() or "implemented" in content.lower():
                    status = "completed"
                elif "in progress" in content.lower() or "implementing" in content.lower():
                    status = "in_progress"
                elif "planned" in content.lower():
                    status = "planned"

                features.append({
                    "name": feature_name,
                    "date": date_str,
                    "status": status,
                    "report_file": str(report_file.relative_to(self.project_root))
                })

            except Exception as e:
                print(f"⚠️  Error parsing {report_file.name}: {e}", file=sys.stderr)

        return features

    def _consolidate_bugs(self) -> List[Dict]:
        """Extract bug and fix information from debugger reports"""
        bugs = []
        reports_dir = self.agent_dir / "Reports"

        if not reports_dir.exists():
            return bugs

        for report_file in sorted(reports_dir.glob("debugger-*.md"), key=lambda p: p.stat().st_mtime, reverse=True):
            try:
                content = report_file.read_text()

                # Extract date from filename
                match = re.search(r'(\d{8})', report_file.name)
                date_str = match.group(1) if match else "unknown"

                # Extract bug description
                bug_name = None
                for line in content.split('\n')[:20]:
                    if line.startswith('# '):
                        bug_name = line[2:].strip()
                        break

                if not bug_name:
                    # Extract from filename
                    parts = report_file.stem.split('-')
                    if len(parts) > 2:
                        bug_name = '-'.join(parts[2:])
                    else:
                        bug_name = report_file.stem

                # Determine status
                status = "unknown"
                if "fixed" in content.lower() or "resolved" in content.lower():
                    status = "fixed"
                elif "investigating" in content.lower():
                    status = "investigating"
                elif "identified" in content.lower():
                    status = "identified"

                # Try to extract root cause
                root_cause = None
                if "root cause" in content.lower():
                    lines = content.split('\n')
                    for i, line in enumerate(lines):
                        if "root cause" in line.lower():
                            # Get next few lines
                            root_cause = '\n'.join(lines[i:i+3]).strip()
                            break

                bugs.append({
                    "name": bug_name,
                    "date": date_str,
                    "status": status,
                    "root_cause": root_cause,
                    "report_file": str(report_file.relative_to(self.project_root))
                })

            except Exception as e:
                print(f"⚠️  Error parsing {report_file.name}: {e}", file=sys.stderr)

        return bugs

    def _consolidate_tests(self) -> List[Dict]:
        """Extract testing information from test-executor reports"""
        tests = []
        reports_dir = self.agent_dir / "Reports"

        if not reports_dir.exists():
            return tests

        for report_file in sorted(reports_dir.glob("test-executor-*.md"), key=lambda p: p.stat().st_mtime, reverse=True):
            try:
                content = report_file.read_text()

                # Extract date from filename
                match = re.search(r'(\d{8})', report_file.name)
                date_str = match.group(1) if match else "unknown"

                # Extract test subject
                test_name = None
                for line in content.split('\n')[:20]:
                    if line.startswith('# '):
                        test_name = line[2:].strip()
                        break

                if not test_name:
                    parts = report_file.stem.split('-')
                    if len(parts) > 3:
                        test_name = '-'.join(parts[3:])
                    else:
                        test_name = report_file.stem

                # Determine pass/fail status
                status = "unknown"
                if "✅" in content or "passed" in content.lower():
                    status = "passed"
                elif "❌" in content or "failed" in content.lower():
                    status = "failed"
                elif "⚠️" in content or "warning" in content.lower():
                    status = "warning"

                # Count test results if available
                passed_count = content.lower().count("test passed") + content.count("✅")
                failed_count = content.lower().count("test failed") + content.count("❌")

                tests.append({
                    "name": test_name,
                    "date": date_str,
                    "status": status,
                    "passed_count": passed_count,
                    "failed_count": failed_count,
                    "report_file": str(report_file.relative_to(self.project_root))
                })

            except Exception as e:
                print(f"⚠️  Error parsing {report_file.name}: {e}", file=sys.stderr)

        return tests

    def _consolidate_system(self) -> Dict:
        """Extract current system state from System/ docs"""
        system_state = {}
        system_dir = self.agent_dir / "System"

        if not system_dir.exists():
            return system_state

        for doc_file in system_dir.glob("*.md"):
            try:
                content = doc_file.read_text()

                # Extract first paragraph as summary
                lines = content.split('\n')
                summary_lines = []
                in_summary = False

                for line in lines:
                    if line.startswith('# '):
                        in_summary = True
                        continue
                    if in_summary:
                        if line.strip() and not line.startswith('#'):
                            summary_lines.append(line.strip())
                        elif line.startswith('#') and summary_lines:
                            break
                        if len(summary_lines) >= 3:  # First 3 paragraphs
                            break

                system_state[doc_file.stem] = {
                    "file": str(doc_file.relative_to(self.project_root)),
                    "last_modified": datetime.fromtimestamp(doc_file.stat().st_mtime).isoformat(),
                    "summary": ' '.join(summary_lines[:3]) if summary_lines else "No summary available",
                    "size": len(content)
                }

            except Exception as e:
                print(f"⚠️  Error parsing {doc_file.name}: {e}", file=sys.stderr)

        return system_state

    def _consolidate_tasks(self) -> List[Dict]:
        """Extract active tasks from Tasks/ directory"""
        tasks = []
        tasks_dir = self.agent_dir / "Tasks"

        if not tasks_dir.exists():
            return tasks

        # Look for context.md and current_plan.md
        context_file = tasks_dir / "context.md"
        plan_file = tasks_dir / "current_plan.md"

        if context_file.exists():
            try:
                content = context_file.read_text()

                # Extract active tasks section
                active_tasks = []
                in_active_section = False

                for line in content.split('\n'):
                    if "## Active Tasks" in line or "## Current Tasks" in line:
                        in_active_section = True
                        continue
                    if in_active_section:
                        if line.startswith('##'):
                            break
                        if line.strip() and (line.strip().startswith('-') or line.strip().startswith('*')):
                            active_tasks.append(line.strip()[2:].strip())

                tasks.append({
                    "source": "context.md",
                    "tasks": active_tasks,
                    "last_modified": datetime.fromtimestamp(context_file.stat().st_mtime).isoformat()
                })

            except Exception as e:
                print(f"⚠️  Error parsing context.md: {e}", file=sys.stderr)

        if plan_file.exists():
            try:
                content = plan_file.read_text()

                # Extract plan items
                plan_items = []
                for line in content.split('\n'):
                    if re.match(r'^\d+\.', line.strip()):  # Numbered list
                        plan_items.append(line.strip())

                tasks.append({
                    "source": "current_plan.md",
                    "tasks": plan_items,
                    "last_modified": datetime.fromtimestamp(plan_file.stat().st_mtime).isoformat()
                })

            except Exception as e:
                print(f"⚠️  Error parsing current_plan.md: {e}", file=sys.stderr)

        return tasks


def format_consolidated_report(consolidated: Dict) -> str:
    """Format consolidated data as readable markdown"""
    if "error" in consolidated:
        return f"❌ Error: {consolidated['error']}"

    lines = []
    lines.append("# Consolidated Project Context")
    lines.append(f"\n**Generated:** {consolidated['generated_at']}")
    lines.append(f"**Project:** {consolidated['project_root']}\n")
    lines.append("---\n")

    # Features
    features = consolidated.get('features', [])
    if features:
        lines.append("## 🎯 Features\n")
        for feature in features[:10]:  # Top 10 most recent
            status_emoji = {"completed": "✅", "in_progress": "🔄", "planned": "📋"}.get(feature['status'], "❓")
            lines.append(f"### {status_emoji} {feature['name']}")
            lines.append(f"- **Date:** {feature['date']}")
            lines.append(f"- **Status:** {feature['status']}")
            lines.append(f"- **Report:** `{feature['report_file']}`\n")

    # Bugs
    bugs = consolidated.get('bugs_and_fixes', [])
    if bugs:
        lines.append("## 🐛 Bugs & Fixes\n")
        for bug in bugs[:10]:  # Top 10 most recent
            status_emoji = {"fixed": "✅", "investigating": "🔍", "identified": "⚠️"}.get(bug['status'], "❓")
            lines.append(f"### {status_emoji} {bug['name']}")
            lines.append(f"- **Date:** {bug['date']}")
            lines.append(f"- **Status:** {bug['status']}")
            if bug.get('root_cause'):
                lines.append(f"- **Root Cause:** {bug['root_cause'][:100]}...")
            lines.append(f"- **Report:** `{bug['report_file']}`\n")

    # Tests
    tests = consolidated.get('testing_status', [])
    if tests:
        lines.append("## 🧪 Testing Status\n")
        for test in tests[:10]:  # Top 10 most recent
            status_emoji = {"passed": "✅", "failed": "❌", "warning": "⚠️"}.get(test['status'], "❓")
            lines.append(f"### {status_emoji} {test['name']}")
            lines.append(f"- **Date:** {test['date']}")
            lines.append(f"- **Status:** {test['status']}")
            if test['passed_count'] > 0 or test['failed_count'] > 0:
                lines.append(f"- **Results:** {test['passed_count']} passed, {test['failed_count']} failed")
            lines.append(f"- **Report:** `{test['report_file']}`\n")

    # System State
    system = consolidated.get('system_state', {})
    if system:
        lines.append("## 🏗️ System State\n")
        for doc_name, doc_info in system.items():
            lines.append(f"### {doc_name.replace('_', ' ').title()}")
            lines.append(f"- **File:** `{doc_info['file']}`")
            lines.append(f"- **Last Updated:** {doc_info['last_modified']}")
            lines.append(f"- **Summary:** {doc_info['summary'][:200]}...\n")

    # Active Tasks
    active_tasks = consolidated.get('active_tasks', [])
    if active_tasks:
        lines.append("## 📋 Active Tasks\n")
        for task_group in active_tasks:
            lines.append(f"### From {task_group['source']}")
            lines.append(f"**Last Updated:** {task_group['last_modified']}\n")
            for task in task_group['tasks']:
                lines.append(f"- {task}")
            lines.append("")

    lines.append("---")
    lines.append("*This consolidated context provides a snapshot of the project state.*")
    lines.append("*Use this to understand recent work, active issues, and system architecture.*")

    return "\n".join(lines)


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Consolidate context from .agent/ directory")
    parser.add_argument("--path", default=".", help="Path to project root (default: current directory)")
    parser.add_argument("--output", help="Output file path (default: print to stdout)")

    args = parser.parse_args()

    consolidator = ContextConsolidator(args.path)
    result = consolidator.consolidate()

    formatted = format_consolidated_report(result)

    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(formatted)
        print(f"✅ Consolidated context written to: {output_path}")
    else:
        print(formatted)


if __name__ == "__main__":
    main()
